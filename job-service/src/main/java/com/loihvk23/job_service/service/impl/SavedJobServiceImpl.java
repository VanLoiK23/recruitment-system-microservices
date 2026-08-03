package com.loihvk23.job_service.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.document.SavedJobDocument;
import com.loihvk23.job_service.dto.response.JobSavedOrViewedResponse;
import com.loihvk23.job_service.mapper.JobMapper;
import com.loihvk23.job_service.mapper.SavedJobMapper;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.repository.SavedJobRepository;
import com.loihvk23.job_service.service.SavedJobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {
	private final SavedJobRepository savedJobRepository;

	private final SavedJobMapper mapper;

	private final JobRepository jobRepository;

	private final JobMapper jobMapper;

	@Override
	public void saveJob(String jobId, String userEmail) {
		if (checkJobIsSaved(jobId, userEmail)) {
			// unsave job
			savedJobRepository.deleteByUserEmailAndJobId(userEmail, jobId);
		}
		SavedJobDocument savedJobDocument = SavedJobDocument.builder().userEmail(userEmail).jobId(jobId)
				.createdAt(LocalDateTime.now()).build();

		savedJobRepository.save(savedJobDocument);
	}

	@Override
	public boolean checkJobIsSaved(String jobId, String userEmail) {
		List<SavedJobDocument> savedJobDocuments = savedJobRepository.findByUserEmailAndJobId(userEmail, jobId);

		if (savedJobDocuments != null && !savedJobDocuments.isEmpty()) {
			return true;
		}
		return false;
	}

	@Override
	public Slice<JobSavedOrViewedResponse> findSavedJobsByUser(String userEmail, Pageable pageable) {
		Slice<SavedJobDocument> saveJobs = savedJobRepository.findByUserEmail(userEmail, pageable);

		if (!saveJobs.hasContent()) {
			return saveJobs.map(job -> new JobSavedOrViewedResponse());
		}

		List<String> jobIds = saveJobs.getContent().stream().map(SavedJobDocument::getJobId).distinct()
				.collect(Collectors.toList());
		Iterable<JobDocument> jobsIterable = jobRepository.findAllById(jobIds);
		
		Map<String, JobDetailHolder> jobDetailMap = new HashMap<String, JobDetailHolder>();
		jobsIterable.forEach((job)->{
			jobDetailMap.put(job.getId(), new JobDetailHolder(job.getTitle(), job.getStatus()));
		});

		Slice<JobSavedOrViewedResponse> saveJobDTOs = saveJobs.map(savedJob -> {
			JobSavedOrViewedResponse dto = new JobSavedOrViewedResponse();
			dto.setId(savedJob.getId());
			dto.setJobId(savedJob.getJobId());
			dto.setCreatedAt(savedJob.getCreatedAt());
			
			JobDetailHolder detail = jobDetailMap.get(savedJob.getJobId());

			if (detail != null) {
				dto.setTitle(detail.title());  
				dto.setStatus(detail.status());
			}

			return dto;
		});

		return saveJobDTOs;
	}

	record JobDetailHolder(String title, String status) {
	}

}
