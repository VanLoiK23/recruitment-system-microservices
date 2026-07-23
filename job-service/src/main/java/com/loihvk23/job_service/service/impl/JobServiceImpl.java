package com.loihvk23.job_service.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.AdvanceFilterRequest;
import com.loihvk23.job_service.dto.request.JobEvent;
import com.loihvk23.job_service.exception.DuplicateResourceException;
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

	private final RabbitTemplate rabbitTemplate;

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

		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).recruiterEmail(recruiterEmail)
				.status(jobSaveDto.getStatus()).build();
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

		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).recruiterEmail(recruiterEmail)
				.status(jobSaveDto.getStatus()).build();

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
	public JobDTO findDetailJob(String jobId) {
		JobDocument jobDocument = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job isn't exist. Can not see !!"));

		return jobMapper.toDTO(jobDocument);
	}

	@Override
	public Slice<JobDTO> filterAdvanceJobs(AdvanceFilterRequest searchRequest, Pageable pageable) {

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

	@Override
	public Slice<JobDTO> findJobRelevants(List<String> technologies, Pageable pageable) {
		Slice<JobDocument> jobDocumentSlices = jobRepository.findByTechnologies(technologies, pageable);

		Slice<JobDTO> jobDtos = jobDocumentSlices.map(jobMapper::toDTO);

		return jobDtos;
	}

}
