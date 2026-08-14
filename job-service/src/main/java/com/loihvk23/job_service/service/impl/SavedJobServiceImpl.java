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
import com.loihvk23.job_service.dto.response.JobManagementResponse;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.repository.SavedJobRepository;
import com.loihvk23.job_service.service.SavedJobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {
	private final SavedJobRepository savedJobRepository;

	private final JobRepository jobRepository;

	@Override
	public boolean saveJob(String jobId, String userEmail) {
		if (checkJobIsSaved(jobId, userEmail)) {
			// unsave job
			savedJobRepository.deleteByUserEmailAndJobId(userEmail, jobId);
			return false;
		}
		SavedJobDocument savedJobDocument = SavedJobDocument.builder().userEmail(userEmail).jobId(jobId)
				.createdAt(LocalDateTime.now()).build();

		savedJobRepository.save(savedJobDocument);
		return true;
	}

	@Override
	public boolean checkJobIsSaved(String jobId, String userEmail) {
		return savedJobRepository.existsByUserEmailAndJobId(userEmail, jobId);
	}

	@Override
	public Slice<JobManagementResponse> findSavedJobsByUser(String userEmail, Pageable pageable) {
		Slice<SavedJobDocument> saveJobs = savedJobRepository.findByUserEmail(userEmail, pageable);

		if (!saveJobs.hasContent()) {
			return saveJobs.map(job -> new JobManagementResponse());
		}

		List<String> jobIds = saveJobs.getContent().stream().map(SavedJobDocument::getJobId).distinct()
				.collect(Collectors.toList());
		Iterable<JobDocument> jobsIterable = jobRepository.findAllById(jobIds);

		Map<String, JobDetailHolder> jobDetailMap = new HashMap<String, JobDetailHolder>();
		jobsIterable.forEach((job) -> {
			jobDetailMap.put(job.getId(), new JobDetailHolder(job.getTitle(), job.getStatus().toString()));
		});

		Slice<JobManagementResponse> saveJobDTOs = saveJobs.map(savedJob -> {
			JobManagementResponse dto = new JobManagementResponse();
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
