package com.loihvk23.application_service.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.application_service.StatusEnum;
import com.loihvk23.application_service.config.RabbitMQConfig;
import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.JobCacheDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.dto.request.UserAppliedJobEvent;
import com.loihvk23.application_service.dto.response.JobApplicationsResponseDTO;
import com.loihvk23.application_service.entity.ApplicationEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.mapper.ApplicationMapper;
import com.loihvk23.application_service.repository.ApplicationRepository;
import com.loihvk23.application_service.service.ApplicationService;
import com.loihvk23.application_service.service.JobCacheService;

import jakarta.persistence.EntityExistsException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

	private final ApplicationRepository applicationRepository;

	private final ApplicationMapper applicationMapper;

	private final JobCacheService jobCacheService;

	private final RabbitTemplate rabbitTemplate;

	@Override
	@Transactional // if one of actions does not success then roll-back all
	public ApplicationDTO postApplicationApplyJob(ApplicationRequest applicationRequest, String emailCandidate) {
		JobCacheDTO jobCacheDTO = jobCacheService.findJobById(applicationRequest.getJobId());

		if (jobCacheDTO == null) {
			throw new ResourceNotFoundException("The Job you are applying does not exist!");
		}

		if (!jobCacheDTO.getStatus().equalsIgnoreCase("opening")) {
			throw new BadRequestException("This job is no longer active!");
		}

		if (jobCacheDTO.getDeadline() != null && jobCacheDTO.getDeadline().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("This job application deadline has expired!");
		}

		List<ApplicationEntity> applicationEntities = applicationRepository.findByCandidateEmailAndJobId(emailCandidate,
				applicationRequest.getJobId());

		if (applicationEntities != null && !applicationEntities.isEmpty()) {
			boolean hasActiveApplication = applicationEntities.stream()
					.anyMatch(app -> app.getStatus().equalsIgnoreCase("PENDING")
							|| app.getStatus().equalsIgnoreCase("REVIEWING"));

			if (hasActiveApplication) {
				throw new EntityExistsException("You have apply for this Job and wait the recruiter approves!");
			}
		}

		if (applicationRequest.getCvUrl().isEmpty()) {
			throw new IllegalArgumentException("Url cv is required !!");
		}

		ApplicationDTO applicationDTO = ApplicationDTO.builder().jobId(applicationRequest.getJobId())
				.cvUrl(applicationRequest.getCvUrl()).status("PENDING").createdAt(LocalDateTime.now())
				.description(applicationRequest.getDescription()).candidateEmail(emailCandidate)
				.fullName(applicationRequest.getFullName()).phone(applicationRequest.getPhone()).build();

		ApplicationEntity applicationEntity = applicationRepository.save(applicationMapper.toEntity(applicationDTO));

		UserAppliedJobEvent jobAppliedEvent = UserAppliedJobEvent.builder().candidateEmail(emailCandidate)
				.jobId(applicationRequest.getJobId()).status(applicationEntity.getStatus())
				.createdAt(LocalDateTime.now()).build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_EVENT_APPLY, jobAppliedEvent);

		return applicationMapper.toDTO(applicationEntity);
	}

	@Override
	public boolean checkJobApply(String jobId, String emailCandidate) {
		JobCacheDTO jobCacheDTO = jobCacheService.findJobById(jobId);

		if (jobCacheDTO == null) {
			throw new ResourceNotFoundException("Job isn't exist!");
		}

		return applicationRepository.existsByCandidateEmailAndJobId(emailCandidate, jobId);
	}

	// if non valid throw exception
	private static void checkValidStatus(String status) {
		boolean isValidStatus = Stream.of(StatusEnum.values())
				.anyMatch(enumConstant -> enumConstant.name().equals(status));

		if (!isValidStatus) {
			throw new IllegalArgumentException(
					"Invalid status value! Must be one of: PENDING, REVIEWING, INTERVIEW, REJECTED, ACCEPTED");
		}
	}

	@Override
	public ApplicationDTO updateStatusApplication(Long applicationId, String emailRecruiter, String status) {
		ApplicationEntity applicationEntity = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		JobCacheDTO jobCache = jobCacheService.findJobById(applicationEntity.getJobId());
		if (jobCache == null) {
			throw new ResourceNotFoundException("The job post linked to this application (Job ID: "
					+ applicationEntity.getJobId() + ") is no longer available.");
		}
		if (!jobCache.getRecruiterEmail().equalsIgnoreCase(emailRecruiter)) {
			throw new IllegalArgumentException(
					"You can't update status application (This job wasn't been created by " + emailRecruiter + ")");
		}

		if (applicationEntity.getStatus().equalsIgnoreCase(status)) {
			throw new IllegalArgumentException("You can't update old status");
		}

		String upperStatus = status.toUpperCase();

		checkValidStatus(upperStatus);

		applicationEntity.setStatus(upperStatus);

		ApplicationEntity savedEntity = applicationRepository.save(applicationEntity);

		UserAppliedJobEvent jobAppliedEvent = UserAppliedJobEvent.builder()
				.candidateEmail(savedEntity.getCandidateEmail()).jobId(savedEntity.getJobId())
				.status(savedEntity.getStatus()).createdAt(savedEntity.getCreatedAt()).build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_EVENT_APPLIED_UPDATE,
				jobAppliedEvent);

		return applicationMapper.toDTO(savedEntity);
	}

	@Override
	public void deleteApplicationById(Long applicationId, String emailCandidate) {
		ApplicationEntity applicationEntity = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		if (!applicationEntity.getCandidateEmail().equalsIgnoreCase(emailCandidate)) {
			throw new IllegalArgumentException(
					"You can't delete the application (This application wasn't been created by " + emailCandidate
							+ ")");
		}

		applicationRepository.deleteById(applicationId);
		UserAppliedJobEvent jobAppliedEvent = UserAppliedJobEvent.builder()
				.candidateEmail(applicationEntity.getCandidateEmail()).jobId(applicationEntity.getJobId()).build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_EVENT_APPLIED_DELETE,
				jobAppliedEvent);
	}

	private void checkValidJobAndRecruiterEmail(String jobId, String emailRecruiter) {
		JobCacheDTO jobCache = jobCacheService.findJobById(jobId);
		if (jobCache == null) {
			throw new ResourceNotFoundException(
					"The job post linked to this application (Job ID: " + jobId + ") is no longer available.");
		}
		if (!jobCache.getRecruiterEmail().equalsIgnoreCase(emailRecruiter)) {
			throw new IllegalArgumentException(
					"You can't access list application (This job wasn't been created by " + emailRecruiter + ")");
		}
	}

	@Override
	public JobApplicationsResponseDTO findApplicationsByJob(String jobId, String emailRecruiter, String status,
			String query, Pageable pageable) {
		checkValidJobAndRecruiterEmail(jobId, emailRecruiter);

		if (status != null && (status.isBlank() || status.equalsIgnoreCase("ALL"))) {
			status = null;
		}

		if (query != null && query.isBlank()) {
			query = null;
		}

		Slice<ApplicationEntity> applicationEntities = applicationRepository.findByJobIdAndStatusAndNameCandidate(jobId,
				status, query, pageable);
		Slice<ApplicationDTO> applicationDtos = applicationEntities.map(applicationMapper::toDTO);

		long totalCandidates = applicationRepository.countByJobId(jobId);
		long numberHighScore = applicationRepository.countByJobIdAndScoreByAIGreaterThanEqual(jobId, 85);
		long numberNotScan = applicationRepository.countByJobIdAndScoreByAIIsNull(jobId);

		return JobApplicationsResponseDTO.builder().totalCandidates(totalCandidates).numberHighScore(numberHighScore)
				.numberNotScan(numberNotScan).applications(applicationDtos).build();
	}

	@Override
	public Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable) {
		Slice<ApplicationEntity> applicationEntities = applicationRepository.findByCandidateEmail(emailCandidate,
				pageable);

		Slice<ApplicationDTO> applicationDtos = applicationEntities.map(applicationMapper::toDTO);

		return applicationDtos;
	}

	@Override
	public ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email, String role) {
		if (role == null || role.isBlank()) {
			throw new IllegalArgumentException("User's role is required. This user has logged in without any role.");
		}

		ApplicationEntity applicationEntity = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		if ("ROLE_CANDIDATE".equals(role) && !applicationEntity.getCandidateEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("You can't see detail this application. (Not authorization)");
		}

		JobCacheDTO jobCache = jobCacheService.findJobById(applicationEntity.getJobId());
		if (jobCache == null) {
			throw new ResourceNotFoundException("The job post linked to this application (Job ID: "
					+ applicationEntity.getJobId() + ") is no longer available.");
		}
		if ("ROLE_RECRUITER".equals(role) && !jobCache.getRecruiterEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("You can't access this application (This application is private)");
		}

		return applicationMapper.toDTO(applicationEntity);
	}

}
