package com.loihvk23.job_service.service.impl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.document.SavedJobDocument;
import com.loihvk23.job_service.document.UserAppliedJobDocument;
import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.AdvanceFilterRequest;
import com.loihvk23.job_service.dto.request.JobEvent;
import com.loihvk23.job_service.dto.response.JobAppliedResponse;
import com.loihvk23.job_service.dto.response.JobManagementResponse;
import com.loihvk23.job_service.exception.DuplicateResourceException;
import com.loihvk23.job_service.exception.ResourceNotFoundException;
import com.loihvk23.job_service.mapper.JobMapper;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.repository.SavedJobRepository;
import com.loihvk23.job_service.repository.UserAppliedJobRepository;
import com.loihvk23.job_service.service.JobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
	private final MongoTemplate mongoTemplate;

	private final JobRepository jobRepository;

	private final JobMapper jobMapper;

	private final RabbitTemplate rabbitTemplate;

	private final RedisTemplate<String, Object> redisTemplate;

	private final SavedJobRepository savedJobRepository;

	private final UserAppliedJobRepository userAppliedJobRepository;

	@Override
	public Slice<JobDTO> findAll(Pageable pageable, String email) {
		Slice<JobDocument> jobDocuments = jobRepository.findAll(pageable);

		Slice<JobDTO> jobDTOs = jobDocuments.map(jobMapper::toDTO);

		if (email == null || jobDTOs.isEmpty()) {
			return jobDTOs;
		}

		List<String> currentJobIds = jobDTOs.getContent().stream().map(JobDTO::getId).collect(Collectors.toList());

		Set<String> savedJobIdsInCurrentPage = savedJobRepository.findByUserEmailAndJobIdIn(email, currentJobIds)
				.stream().map(SavedJobDocument::getJobId).collect(Collectors.toSet());

		Set<String> appliedJobIdsInCurrentPage = userAppliedJobRepository
				.findByCandidateEmailAndJobIdIn(email, currentJobIds).stream().map(UserAppliedJobDocument::getJobId)
				.collect(Collectors.toSet());

		Slice<JobDTO> adjustJobDtos = jobDTOs.map(job -> {
			job.setIsSaved(savedJobIdsInCurrentPage.contains(job.getId()));
			job.setIsApplied(appliedJobIdsInCurrentPage.contains(job.getId()));

			return job;
		});

		return adjustJobDtos;
	}

	@Override
	public Slice<JobDTO> findByRecruiter(String recruiterEmail, Pageable pageable) {
		Slice<JobDocument> jobDocuments = jobRepository.findByRecruiterEmail(recruiterEmail, pageable);
		Slice<JobDTO> jobDTOs = jobDocuments.map(jobMapper::toDTO);

		return jobDTOs;
	}

	@Override
	public int getTotalElementJobByRecruiter(String recruiterEmail) {
		long totalJob = jobRepository.countByRecruiterEmail(recruiterEmail);

		return (int) totalJob;
	}

	@Override
	public JobAppliedResponse getJobAppliedByRecruiter(String recruiterEmail, String query, Pageable pageable) {
		if (query == null || query.isBlank()) {
			return JobAppliedResponse.builder().jobSlice(findByRecruiter(recruiterEmail, pageable))
					.totalElement(getTotalElementJobByRecruiter(recruiterEmail)).build();

		}
		Slice<JobDocument> jobDocuments = jobRepository.findByRecruiterEmailAndTitleContainingIgnoreCase(recruiterEmail,
				query, pageable);
		Slice<JobDTO> jobDTOs = jobDocuments.map(jobMapper::toDTO);

		return JobAppliedResponse.builder().jobSlice(jobDTOs)
				.totalElement(
						(int) jobRepository.countByRecruiterEmailAndTitleContainingIgnoreCase(recruiterEmail, query))
				.build();
	}

	@Override
	@Transactional
	public JobDTO createNewJob(JobDTO jobDTO, String recruiterEmail) {
		jobDTO.setRecruiterEmail(recruiterEmail);

		List<JobDocument> jobDocumentsExist = jobRepository.findByRecruiterEmailAndTitleAndLocationAndStatus(
				jobDTO.getRecruiterEmail(), jobDTO.getTitle(), jobDTO.getLocation(), jobDTO.getStatus());

		if (jobDocumentsExist != null && !jobDocumentsExist.isEmpty()) {
			throw new DuplicateResourceException("This job you has already post it");
		}

		jobDTO.setCreatedAt(LocalDateTime.now());
		JobDocument jobDocument = jobRepository.save(jobMapper.toDocument(jobDTO));
		JobDTO jobSaveDto = jobMapper.toDTO(jobDocument);

		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).title(jobSaveDto.getTitle())
				.recruiterEmail(recruiterEmail).status(jobSaveDto.getStatus()).build();
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_UPSERTED_KEY, jobEvent);

		return jobSaveDto;
	}

	@Override
	@Transactional
	public JobDTO updateJob(JobDTO jobDTO, String jobId, String recruiterEmail) {
		if (!jobDTO.getRecruiterEmail().equalsIgnoreCase(recruiterEmail)) {
			throw new IllegalArgumentException(
					"You can't edit job (This job wasn't been created by " + recruiterEmail + ")");
		}
		jobDTO.setId(jobId);

		JobDocument jobDocument = jobRepository.save(jobMapper.toDocument(jobDTO));
		JobDTO jobSaveDto = jobMapper.toDTO(jobDocument);

		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).title(jobSaveDto.getTitle())
				.recruiterEmail(recruiterEmail).status(jobSaveDto.getStatus()).build();

		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_UPSERTED_KEY, jobEvent);

		return jobSaveDto;
	}

	@Override
	@Transactional
	public void deleteJob(String jobId, String recruiterEmail) {
		JobDocument jobDocument = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job isn't exist. Can not delete !!"));

		JobDTO jobDTO = jobMapper.toDTO(jobDocument);

		if (!jobDTO.getRecruiterEmail().equalsIgnoreCase(recruiterEmail)) {
			throw new IllegalArgumentException(
					"You can't delete job (This job wasn't been created by " + recruiterEmail + ")");
		}

		jobRepository.delete(jobDocument);

		JobEvent jobEvent = JobEvent.builder().id(jobId).build();

		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_DELETE_KEY, jobEvent);
	}

	@Override
	public JobDTO findDetailJob(String jobId, String email) {
		JobDocument jobDocument = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job isn't exist. Can not see !!"));

		if (email == null || jobDocument == null) {
			return jobMapper.toDTO(jobDocument);
		}

		Set<String> savedJobIds = savedJobRepository.findByUserEmailAndJobId(email, jobId).stream()
				.map(SavedJobDocument::getJobId).collect(Collectors.toSet());

		Set<String> appliedJobIds = userAppliedJobRepository.findByCandidateEmailAndJobId(email, jobId).stream()
				.map(UserAppliedJobDocument::getJobId).collect(Collectors.toSet());

		JobDTO jobDTO = jobMapper.toDTO(jobDocument);
		jobDTO.setIsSaved(savedJobIds.contains(jobId));
		jobDTO.setIsApplied(appliedJobIds.contains(jobId));
		return jobDTO;
	}

	@Override
	public Page<JobDTO> filterAdvanceJobs(AdvanceFilterRequest searchRequest, Pageable pageable, String email) {

		Query query = new Query();
		List<Criteria> criterias = new ArrayList<Criteria>();

		if (StringUtils.hasText(searchRequest.getSearch())) {

			String keyword = searchRequest.getSearch().trim();

			Criteria searchCriteria = new Criteria().orOperator(Criteria.where("technologies").regex(keyword, "i"),
					Criteria.where("jobLevel").regex(keyword, "i"), Criteria.where("title").regex(keyword, "i"));
			criterias.add(searchCriteria);
		}

		if (searchRequest.getCategories() != null && !searchRequest.getCategories().isEmpty()) {
			criterias.add(Criteria.where("categories").in(searchRequest.getCategories()));
		}

		if (searchRequest.getExperience() != null && !searchRequest.getExperience().isEmpty()) {
			criterias.add(Criteria.where("jobLevel").regex(searchRequest.getExperience(), "i"));
		}

		if (searchRequest.getWorkType() != null && !searchRequest.getWorkType().isEmpty()) {
			criterias.add(Criteria.where("workType").is(searchRequest.getWorkType()));
		}

		if (searchRequest.getLocations() != null && !searchRequest.getLocations().isEmpty()) {
			criterias.add(Criteria.where("location").in(searchRequest.getLocations()));
		}

		if (searchRequest.getMinSalary() != null && searchRequest.getMinSalary() > 0) {
			Criteria salaryCriteria = Criteria.where("minSalary").gte(searchRequest.getMinSalary());
			if (searchRequest.getMaxSalary() != null && searchRequest.getMaxSalary() > 0) {
				salaryCriteria.lte(searchRequest.getMaxSalary());
			}
			criterias.add(salaryCriteria);
		} else if (searchRequest.getMaxSalary() != null && searchRequest.getMaxSalary() > 0) {
			criterias.add(Criteria.where("maxSalary").lte(searchRequest.getMaxSalary()));
		}

		if (searchRequest.isHotJob()) {
			criterias.add(Criteria.where("hotJob").is(true));
		}

		if (!criterias.isEmpty()) {
			query.addCriteria(new Criteria().andOperator(criterias.toArray(new Criteria[0])));
		}

		long total = mongoTemplate.count(query, JobDocument.class);

		query.with(pageable);
//		query.limit(pageable.getPageSize() + 1);

		List<JobDocument> jobDocuments = mongoTemplate.find(query, JobDocument.class);

//		boolean hasNext = jobDocuments.size() > pageable.getPageSize();
//		if (hasNext) {
//			jobDocuments.remove(pageable.getPageSize()); // remove last residual item
//		}

		List<JobDTO> jobDTOs = jobDocuments.stream().map(jobMapper::toDTO).toList();

		if (email == null || jobDTOs.isEmpty()) {
			return new PageImpl<>(jobDTOs, pageable, total);
		}

		List<String> currentJobIds = jobDTOs.stream().map(JobDTO::getId).collect(Collectors.toList());

		Set<String> savedJobIdsInCurrentPage = savedJobRepository.findByUserEmailAndJobIdIn(email, currentJobIds)
				.stream().map(SavedJobDocument::getJobId).collect(Collectors.toSet());
		Set<String> appliedJobIdsInCurrentPage = userAppliedJobRepository
				.findByCandidateEmailAndJobIdIn(email, currentJobIds).stream().map(UserAppliedJobDocument::getJobId)
				.collect(Collectors.toSet());

		List<JobDTO> adjustJobDtos = jobDTOs.stream().map(job -> {
			job.setIsSaved(savedJobIdsInCurrentPage.contains(job.getId()));
			job.setIsApplied(appliedJobIdsInCurrentPage.contains(job.getId()));

			return job;
		}).collect(Collectors.toList());

		return new PageImpl<>(adjustJobDtos, pageable, total);
	}

	@Override
	public Slice<JobDTO> findJobRelevants(List<String> technologies, String jobId, Pageable pageable, String email) {
		Slice<JobDocument> jobDocumentSlices = jobRepository.findByTechnologiesInAndIdNot(technologies, jobId,
				pageable);

		Slice<JobDTO> jobDTOs = jobDocumentSlices.map(jobMapper::toDTO);

		if (email == null || jobDTOs.isEmpty()) {
			return jobDTOs;
		}

		List<String> currentJobIds = jobDTOs.getContent().stream().map(JobDTO::getId).collect(Collectors.toList());

		Set<String> savedJobIdsInCurrentPage = savedJobRepository.findByUserEmailAndJobIdIn(email, currentJobIds)
				.stream().map(SavedJobDocument::getJobId).collect(Collectors.toSet());
		Set<String> appliedJobIdsInCurrentPage = userAppliedJobRepository
				.findByCandidateEmailAndJobIdIn(email, currentJobIds).stream().map(UserAppliedJobDocument::getJobId)
				.collect(Collectors.toSet());

		Slice<JobDTO> adjustJobDtos = jobDTOs.map(job -> {
			job.setIsSaved(savedJobIdsInCurrentPage.contains(job.getId()));
			job.setIsApplied(appliedJobIdsInCurrentPage.contains(job.getId()));

			return job;
		});

		return adjustJobDtos;
	}

	@Override
	public void incrementApplicantCount(String jobId) {
		Query query = new Query(Criteria.where("id").is(jobId));
		Update update = new Update().inc("applicantCount", 1);
		mongoTemplate.updateFirst(query, update, JobDocument.class);
	}

	@Override
	public void saveViewedJobHistory(String emailCandidate, String jobId) {
		if (emailCandidate == null || jobId == null) {
			return;
		}
		String key = "viewed_jobs:" + emailCandidate;

		double timestamp = System.currentTimeMillis();

		redisTemplate.opsForZSet().add(key, jobId, timestamp);

		Long totalSize = redisTemplate.opsForZSet().zCard(key);
		if (totalSize != null && totalSize > 50) {
			redisTemplate.opsForZSet().removeRange(key, 0, (totalSize - 51));
		}
	}

	@Override
	public Slice<JobManagementResponse> getViewdJobs(String emailCandidate, Pageable pageable) {
		String key = "viewed_jobs:" + emailCandidate;

		Set<TypedTuple<Object>> typedTuples = redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, 49);

		if (typedTuples == null || typedTuples.isEmpty()) {
			return new SliceImpl<>(Collections.emptyList(), pageable, false);
		}

		Map<String, LocalDateTime> viewedAtMap = typedTuples.stream()
				.filter(tuple -> tuple.getValue() != null && tuple.getScore() != null)
				.collect(Collectors.toMap(tuple -> tuple.getValue().toString(), tuple -> {
					long timestamp = tuple.getScore().longValue();
					return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault());
				}, (existing, replacement) -> existing, LinkedHashMap::new));

		List<String> jobIds = new ArrayList<>(viewedAtMap.keySet());
		Iterable<JobDocument> jobs = jobRepository.findAllById(jobIds);

		List<JobManagementResponse> responseList = StreamSupport.stream(jobs.spliterator(), false).map(job -> {
			JobManagementResponse res = new JobManagementResponse();
			res.setId(job.getId());
			res.setJobId(job.getId());
			res.setTitle(job.getTitle());
			res.setStatus(job.getStatus());
			res.setCreatedAt(viewedAtMap.get(job.getId()));
			return res;
		}).sorted(Comparator.comparing(JobManagementResponse::getCreatedAt,
				Comparator.nullsLast(Comparator.reverseOrder()))).collect(Collectors.toList());

		boolean hasNext = responseList.size() > pageable.getPageSize();

		return new SliceImpl<>(responseList, pageable, hasNext);
	}

}
