package com.loihvk23.job_service.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.JobSearchRequest;
import com.loihvk23.job_service.exception.ResourceNotFoundException;
import com.loihvk23.job_service.mapper.JobMapper;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.service.JobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
	private final MongoTemplate mongoTemplate;

	private final JobRepository jobRepository;

	private final JobMapper jobMapper;

	@Override
	public Slice<JobDTO> findAll(Pageable pageable) {
		Slice<JobDocument> jobDocuments = jobRepository.findAll(pageable);

		Slice<JobDTO> jobDTOs = jobDocuments.map(jobMapper::toDTO);

		return jobDTOs;
	}

	@Override
	public Slice<JobDTO> findByRecruiter(String recruiterEmail, Pageable pageable) {
		Slice<JobDocument> jobDocuments = jobRepository.findByRecruiterEmail(recruiterEmail, pageable);

		Slice<JobDTO> jobDTOs = jobDocuments.map(jobMapper::toDTO);

		return jobDTOs;
	}

	@Override
	public JobDTO createNewJob(JobDTO jobDTO) {
		jobDTO.setCreatedAt(LocalDateTime.now());
		JobDocument jobDocument = jobRepository.save(jobMapper.toDocument(jobDTO));

		return jobMapper.toDTO(jobDocument);
	}

	@Override
	public JobDTO updateJob(JobDTO jobDTO, String recruiterEmail) {
		if (!jobDTO.getRecruiterEmail().equalsIgnoreCase(recruiterEmail)) {
			throw new IllegalArgumentException(
					"You can't edit job (This job wasn't been created by " + recruiterEmail + ")");
		}

		JobDocument jobDocument = jobRepository.save(jobMapper.toDocument(jobDTO));

		return jobMapper.toDTO(jobDocument);
	}

	@Override
	public void deleteJob(String jobId, String recruiterEmail) {
		JobDocument jobDocument = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job isn't exist. Can not delete !!"));

		JobDTO jobDTO = jobMapper.toDTO(jobDocument);

		if (!jobDTO.getRecruiterEmail().equalsIgnoreCase(recruiterEmail)) {
			throw new IllegalArgumentException(
					"You can't delete job (This job wasn't been created by " + recruiterEmail + ")");
		}

		jobRepository.delete(jobDocument);
	}

	@Override
	public JobDTO findDetailJob(String jobId) {
		JobDocument jobDocument = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job isn't exist. Can not see !!"));

		return jobMapper.toDTO(jobDocument);
	}

	@Override
	public Slice<JobDTO> filterAdvanceJobs(JobSearchRequest searchRequest, Pageable pageable) {

		Query query = new Query();

		if (searchRequest.getTechnology() != null && !searchRequest.getTechnology().isBlank()) {
			query.addCriteria(Criteria.where("technologies").is(searchRequest.getTechnology()));
		}

		if (searchRequest.getJobLevel() != null && !searchRequest.getJobLevel().isBlank()) {
			query.addCriteria(Criteria.where("jobLevel").is(searchRequest.getJobLevel()));
		}

		if (searchRequest.getLocation() != null && !searchRequest.getLocation().isBlank()) {
			query.addCriteria(Criteria.where("location").regex(searchRequest.getLocation(), "i"));
		}

		if (searchRequest.getMinSalary() != null && searchRequest.getMinSalary() > 0) {
			query.addCriteria(Criteria.where("minSalary").gte(searchRequest.getMinSalary()));
		}

		if (searchRequest.getMaxSalary() != null && searchRequest.getMaxSalary() > 0) {
			query.addCriteria(Criteria.where("maxSalary").lte(searchRequest.getMaxSalary()));
		}

		query.with(pageable);
		query.limit(pageable.getPageSize() + 1);

		List<JobDocument> jobDocuments = mongoTemplate.find(query, JobDocument.class);

		boolean hasNext = jobDocuments.size() > pageable.getPageSize();
		if (hasNext) {
			jobDocuments.remove(pageable.getPageSize()); // remove last residual item
		}

		List<JobDTO> jobDTOs = jobDocuments.stream().map(jobMapper::toDTO).toList();
		return new SliceImpl<>(jobDTOs, pageable, hasNext);
	}

}
