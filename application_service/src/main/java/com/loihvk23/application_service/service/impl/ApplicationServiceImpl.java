package com.loihvk23.application_service.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.application_service.StatusEnum;
import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.entity.ApplicationEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.mapper.ApplicationMapper;
import com.loihvk23.application_service.repository.ApplicationRepository;
import com.loihvk23.application_service.service.ApplicationService;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

	private final ApplicationRepository applicationRepository;

	private final ApplicationMapper applicationMapper;

	@Override
	public ApplicationDTO postApplicationApplyJob(ApplicationRequest applicationRequest, String emailCandidate) {
		List<ApplicationEntity> applicationEntities = applicationRepository.findByCandidateEmailAndJobId(emailCandidate,
				applicationRequest.getJobId());

		if (applicationEntities != null && !applicationEntities.isEmpty()) {
			boolean hasActiveApplication = applicationEntities.stream()
					.anyMatch(app -> app.getStatus().equalsIgnoreCase("PENDING")
							|| app.getStatus().equalsIgnoreCase("REVIEWING"));

			if (hasActiveApplication) {
				throw new EntityExistsException("You have apply for this Job and wait the system approves!");
			}
		}

		ApplicationDTO applicationDTO = ApplicationDTO.builder().jobId(applicationRequest.getJobId())
				.cvUrl(applicationRequest.getCvUrl()).status("PENDING").createdAt(LocalDateTime.now())
				.candidateEmail(emailCandidate).recruiterEmail(applicationRequest.getRecruiterEmail()).build();

		ApplicationEntity applicationEntity = applicationRepository.save(applicationMapper.toEntity(applicationDTO));

		return applicationMapper.toDTO(applicationEntity);
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

		if (!applicationEntity.getRecruiterEmail().equalsIgnoreCase(emailRecruiter)) {
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

		return applicationMapper.toDTO(savedEntity);
	}

	@Override
	public void deleteApplicationById(Long applicationId, String emailCandidate) {
		ApplicationEntity applicationEntity = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		if (!applicationEntity.getCandidateEmail().equalsIgnoreCase(emailCandidate)) {
			throw new IllegalArgumentException(
					"You can't delete status application (This application wasn't been created by " + emailCandidate
							+ ")");
		}

		applicationRepository.deleteById(applicationId);
	}

	@Override
	public Slice<ApplicationDTO> findApplicationsByJob(Long jobId, String emailRecruiter, Pageable pageable) {
		Slice<ApplicationEntity> applicationEntities = applicationRepository.findByJobIdAndRecruiterEmail(jobId,
				emailRecruiter, pageable);

		Slice<ApplicationDTO> applicationDtos = applicationEntities.map(applicationMapper::toDTO);

		return applicationDtos;
	}

	@Override
	public Slice<ApplicationDTO> findApplicationsByJobAndStatus(Long jobId, String status, String emailRecruiter,
			Pageable pageable) {
		Slice<ApplicationEntity> applicationEntities = applicationRepository
				.findByJobIdAndStatusAndRecruiterEmail(jobId, status, emailRecruiter, pageable);

		Slice<ApplicationDTO> applicationDtos = applicationEntities.map(applicationMapper::toDTO);

		return applicationDtos;
	}

	@Override
	public Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable) {
		Slice<ApplicationEntity> applicationEntities = applicationRepository.findByCandidateEmail(emailCandidate,
				pageable);

		Slice<ApplicationDTO> applicationDtos = applicationEntities.map(applicationMapper::toDTO);

		return applicationDtos;
	}

	@Override
	public ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email) {
		ApplicationEntity applicationEntity = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		if ((!applicationEntity.getCandidateEmail().equalsIgnoreCase(email))
				&& (!applicationEntity.getRecruiterEmail().equalsIgnoreCase(email))) {
			throw new IllegalArgumentException("You can't see detail this application. (Not authorization)");
		}

		return applicationMapper.toDTO(applicationEntity);
	}

}
