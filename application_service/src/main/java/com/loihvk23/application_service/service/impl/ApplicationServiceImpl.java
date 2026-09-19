package com.loihvk23.application_service.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loihvk23.application_service.ApplicationStatus;
import com.loihvk23.application_service.CVSource;
import com.loihvk23.application_service.config.RabbitMQConfig;
import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.JobCacheDTO;
import com.loihvk23.application_service.dto.Tier2Result;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.dto.request.CandidateProfileRequest;
import com.loihvk23.application_service.dto.request.ScoreResult;
import com.loihvk23.application_service.dto.request.UserAppliedJobEvent;
import com.loihvk23.application_service.dto.response.JobApplicationsResponseDTO;
import com.loihvk23.application_service.entity.ApplicationEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.helper.ConvertProfileToCVText;
import com.loihvk23.application_service.helper.DocumentExtractionService;
import com.loihvk23.application_service.mapper.ApplicationMapper;
import com.loihvk23.application_service.repository.ApplicationRepository;
import com.loihvk23.application_service.service.ApplicationService;
import com.loihvk23.application_service.service.JobCacheService;
import com.loihvk23.application_service.service.client.GeminiTier2Client;

import jakarta.persistence.EntityExistsException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

	private final ApplicationRepository applicationRepository;

	private final ApplicationMapper applicationMapper;

	private final JobCacheService jobCacheService;

	private final RabbitTemplate rabbitTemplate;

	private final DocumentExtractionService documentExtractionService;

	private final ObjectMapper objectMapper;

	private final ConvertProfileToCVText convert;

	private final GeminiTier2Client geminiClient;

	@Override
	@Transactional // if one of actions does not success then roll-back all
	public ApplicationDTO postApplicationApplyJob(ApplicationRequest applicationRequest, String emailCandidate) {
		JobCacheDTO jobCacheDTO = jobCacheService.findJobById(applicationRequest.getJobId());
		boolean isUrl = CVSource.URL.equals(applicationRequest.getCvSourceType());

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
					.anyMatch(app -> ApplicationStatus.PENDING.equals(app.getStatus())
							|| ApplicationStatus.SCORED.equals(app.getStatus())
							|| ApplicationStatus.REVIEWING.equals(app.getStatus()));

			if (hasActiveApplication) {
				throw new EntityExistsException("You have apply for this Job and wait the recruiter approves!");
			}
		}

		if (isUrl) {
			if (applicationRequest.getCvUrl().isEmpty()) {
				throw new IllegalArgumentException("Url cv is required !!");
			}
		}

		ApplicationDTO.ApplicationDTOBuilder builder = ApplicationDTO.builder().jobId(applicationRequest.getJobId())
				.status(ApplicationStatus.PENDING).description(applicationRequest.getDescription())
				.candidateEmail(emailCandidate).fullName(applicationRequest.getFullName())
				.cvSourceType(applicationRequest.getCvSourceType()).phone(applicationRequest.getPhone())
				.createdAt(LocalDateTime.now());

		String cvTextForScoring; // CV text to sent to job-service for scoring(matching jd CV)

		if (isUrl) {
			String extractedText = documentExtractionService.extractTextFromUrl(applicationRequest.getCvUrl());
			builder.cvUrl(applicationRequest.getCvUrl());
			builder.cvTextExtracted(extractedText); // avoid if candidate remove file CV
			cvTextForScoring = extractedText;
		} else {
			CandidateProfileRequest profile = applicationRequest.getCandidateProfileRequest();
			String builtText = convert.buildCvTextFromProfile(profile);
			try {
				builder.cvSnapshotJson(objectMapper.writeValueAsString(profile));
			} catch (JsonProcessingException e) {
				throw new RuntimeException("Failed to snapshot profile", e);
			}
			builder.cvTextExtracted(builtText);
			builder.fullName(profile.getFullName());
			builder.phone(profile.getPhone());
			cvTextForScoring = builtText;
		}

		ApplicationDTO applicationDTO = builder.build();

		ApplicationEntity applicationEntity = applicationRepository.save(applicationMapper.toEntity(applicationDTO));

		UserAppliedJobEvent jobAppliedEvent = UserAppliedJobEvent.builder().candidateEmail(emailCandidate)
				.jobId(applicationRequest.getJobId()).status(applicationEntity.getStatus().toString())
				.createdAt(LocalDateTime.now()).appID(applicationEntity.getId()).cvTextForScoring(cvTextForScoring)
				.build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.APPLICATION_EVENT_SAVE, jobAppliedEvent);

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
		boolean isValidStatus = Stream.of(ApplicationStatus.values())
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

		if (ApplicationStatus.SCORED.toString().equalsIgnoreCase(status)) {
			throw new IllegalArgumentException("You can't update invalid status");
		}

		if (applicationEntity.getStatus().toString().equalsIgnoreCase(status)) {
			throw new IllegalArgumentException("You can't update old status");
		}

		String upperStatus = status.toUpperCase();

		checkValidStatus(upperStatus);

		applicationEntity.setStatus(ApplicationStatus.valueOf(upperStatus));

		ApplicationEntity savedEntity = applicationRepository.save(applicationEntity);

		UserAppliedJobEvent jobAppliedEvent = UserAppliedJobEvent.builder()
				.candidateEmail(savedEntity.getCandidateEmail()).jobId(savedEntity.getJobId())
				.status(savedEntity.getStatus().toString()).createdAt(savedEntity.getCreatedAt()).build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.APPLICATION_EVENT_UPDATE,
				jobAppliedEvent);

		return applicationMapper.toDTO(savedEntity);
	}

	@Override
	@Transactional
	public void updateBulkStatusApplication(List<Long> ids, String emailRecruiter, String status) {
		ApplicationEntity testApplicationEntity = applicationRepository.findById(ids.get(0))
				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));

		checkValidJobAndRecruiterEmail(testApplicationEntity.getJobId(), emailRecruiter);
		
		if (ApplicationStatus.SCORED.toString().equalsIgnoreCase(status)) {
			throw new IllegalArgumentException("You can't update invalid status");
		}

		String upperStatus = status.toUpperCase();
		ApplicationStatus newStatus = ApplicationStatus.valueOf(upperStatus);

		checkValidStatus(upperStatus);

		List<ApplicationEntity> applicationEntities = applicationRepository.findAllById(ids);

		applicationEntities.forEach(app -> app.setStatus(newStatus));

		List<ApplicationEntity> applicationSavedEntities = applicationRepository.saveAll(applicationEntities);

		List<UserAppliedJobEvent> userAppliedJobEvents = applicationSavedEntities.stream()
				.map(savedEntity -> UserAppliedJobEvent.builder().candidateEmail(savedEntity.getCandidateEmail())
						.jobId(savedEntity.getJobId()).status(savedEntity.getStatus().toString())
						.createdAt(savedEntity.getCreatedAt()).build())
				.toList();

		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.APPLICATION_EVENT_BULK_UPDATE,
				userAppliedJobEvents);
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
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.APPLICATION_EVENT_DELETE,
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

		ApplicationStatus jobStatus = null;

		if (status != null) {
			jobStatus = ApplicationStatus.valueOf(status);
		}

		Slice<ApplicationEntity> applicationEntities = applicationRepository.findByJobIdAndStatusAndNameCandidate(jobId,
				jobStatus, query, pageable);
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

	@Override
	public ApplicationDTO updateScoreTier1Application(Long appId, ScoreResult scoreResult) {
		ApplicationEntity applicationEntity = applicationRepository.findById(appId)
				.orElseThrow(() -> new IllegalArgumentException("Application doesn't exist"));

		applicationEntity.setScoreByAI(scoreResult.getFinalScore());
		applicationEntity.setVerdict(scoreResult.getVerdict());
		applicationEntity.setSeniorityMismatchWarning(scoreResult.getSeniorityMismatchWarning());
		applicationEntity.setJobTextSnapshot(scoreResult.getJobTextSnapshot());
		applicationEntity.setStatus(ApplicationStatus.SCORED);

		ApplicationEntity applicationSavedEntity = applicationRepository.save(applicationEntity);

		return applicationMapper.toDTO(applicationSavedEntity);
	}

//	@Override
//	public Mono<ApplicationDTO> updateAIResultApplicationDTO(Long applicationId) {
//		ApplicationEntity app = applicationRepository.findById(applicationId)
//				.orElseThrow(() -> new ResourceNotFoundException("The application doesn't exist. Try again !!"));
//
//		String cvContent = geminiClient.resolveCvContent(app.getCvSnapshotJson(), app.getCvTextExtracted());
//
//		return geminiClient.scoreDetailed(cvContent, app.getJobTextSnapshot()).map(result -> {
//			try {
//				app.setAiAnalysisResult(objectMapper.writeValueAsString(result));
//
//				ApplicationEntity savedApp = applicationRepository.save(app);
//
//				return applicationMapper.toDTO(savedApp);
//
//			} catch (Exception e) {
//				e.printStackTrace();
//				throw new RuntimeException("Error mapping AI result or saving to DB", e);
//			}
//		}).subscribeOn(Schedulers.boundedElastic());
//	}

	@Override
	public Mono<ApplicationDTO> updateAIResultApplicationDTO(Long applicationId) {
		return Mono
				.fromCallable(() -> applicationRepository.findById(applicationId).orElseThrow(
						() -> new ResourceNotFoundException("The application doesn't exist. Try again !!")))
				.subscribeOn(Schedulers.boundedElastic()).flatMap(app -> {
					if (app.getAiAnalysisResult() != null && !app.getAiAnalysisResult().isBlank()) {
						return Mono.just(applicationMapper.toDTO(app));
					}
					String cvContent = geminiClient.resolveCvContent(app.getCvSnapshotJson(), app.getCvTextExtracted());

					return geminiClient.scoreDetailed(cvContent, app.getJobTextSnapshot())
							.flatMap(result -> saveAiResult(app, result));
				});
	}

	private Mono<ApplicationDTO> saveAiResult(ApplicationEntity app, Tier2Result result) {
		return Mono.fromCallable(() -> {
			try {
				app.setAiAnalysisResult(objectMapper.writeValueAsString(result));
				ApplicationEntity savedApp = applicationRepository.save(app);
				return applicationMapper.toDTO(savedApp);
			} catch (Exception e) {
				throw new RuntimeException("Error mapping AI result or saving to DB", e);
			}
		}).subscribeOn(Schedulers.boundedElastic());
	}

}
