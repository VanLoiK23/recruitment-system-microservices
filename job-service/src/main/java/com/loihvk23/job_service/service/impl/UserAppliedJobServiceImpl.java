package com.loihvk23.job_service.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.document.UserAppliedJobDocument;
import com.loihvk23.job_service.dto.UserAppliedJobDTO;
import com.loihvk23.job_service.dto.response.JobManagementResponse;
import com.loihvk23.job_service.mapper.UserAppliedJobMapper;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.repository.UserAppliedJobRepository;
import com.loihvk23.job_service.service.UserAppliedJobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAppliedJobServiceImpl implements UserAppliedJobService {
	private final UserAppliedJobRepository userAppliedJobRepository;

	private final UserAppliedJobMapper mapper;

	private final JobRepository jobRepository;


	@Override
	public void deleteAppliedJob(String jobId, String candidateEmail) {
		userAppliedJobRepository.deleteByCandidateEmailAndJobId(candidateEmail, jobId);
	}

	@Override
	public boolean checkJobApplied(String jobId, String candidateEmail) {
		List<UserAppliedJobDocument> jobApplied = userAppliedJobRepository.findByCandidateEmailAndJobId(candidateEmail,
				jobId);

		if (jobApplied == null || jobApplied.isEmpty()) {
			return false;
		}
		return true;
	}

	@Override
	public Slice<JobManagementResponse> findAppliedJobsByUser(String candidateEmail, Pageable pageable) {
		Slice<UserAppliedJobDocument> appliedJobs = userAppliedJobRepository.findByCandidateEmail(candidateEmail,
				pageable);

		if (!appliedJobs.hasContent()) {
			return appliedJobs.map(job -> new JobManagementResponse());
		}

		List<String> jobIds = appliedJobs.getContent().stream().map(UserAppliedJobDocument::getJobId).distinct()
				.collect(Collectors.toList());
		Iterable<JobDocument> jobsIterable = jobRepository.findAllById(jobIds);

		Map<String, String> jobDetailMap = new HashMap<String, String>();
		jobsIterable.forEach((job) -> {
			jobDetailMap.put(job.getId(), job.getTitle());
		});

		Slice<JobManagementResponse> saveJobDTOs = appliedJobs.map(appliedJob -> {
			JobManagementResponse dto = new JobManagementResponse();
			dto.setId(appliedJob.getId());
			dto.setJobId(appliedJob.getJobId());
			dto.setCreatedAt(appliedJob.getCreatedAt());
			dto.setStatus(appliedJob.getStatus());

			String title = jobDetailMap.get(appliedJob.getJobId());

			dto.setTitle(title);

			return dto;
		});

		return saveJobDTOs;
	}

	@Override
	public void saveAppliedJob(UserAppliedJobDTO userAppliedJobDTO) {
		userAppliedJobRepository.save(mapper.toDocument(userAppliedJobDTO));
	}

}
