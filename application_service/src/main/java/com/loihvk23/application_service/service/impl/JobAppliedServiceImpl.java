package com.loihvk23.application_service.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.application_service.dto.response.JobAppliedDTO;
import com.loihvk23.application_service.entity.ApplicationEntity;
import com.loihvk23.application_service.entity.JobCacheEntity;
import com.loihvk23.application_service.repository.ApplicationRepository;
import com.loihvk23.application_service.repository.JobCacheRepository;
import com.loihvk23.application_service.service.JobAppliedService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobAppliedServiceImpl implements JobAppliedService {
	private final JobCacheRepository jobCacheRepository;

	private final ApplicationRepository applicationRepository;

	@Override
	public Slice<JobAppliedDTO> findJobAppliedByCandidate(String emailCandidate, Pageable pageable) {
		Slice<ApplicationEntity> applicationsEntity = applicationRepository.findByCandidateEmail(emailCandidate,
				pageable);

		if (!applicationsEntity.hasContent()) {
			return applicationsEntity.map(app -> new JobAppliedDTO());
		}

		List<String> jobIds = applicationsEntity.getContent().stream().map(ApplicationEntity::getJobId).distinct()
				.collect(Collectors.toList());

		Iterable<JobCacheEntity> jobCaches = jobCacheRepository.findAllById(jobIds);
		Map<String, String> jobTitleMap = new HashMap<String, String>();

		jobCaches.forEach(job -> {
			jobTitleMap.put(job.getId(), job.getTitle());
		});

		return applicationsEntity.map(application -> {
			JobAppliedDTO jobAppliedDTO = new JobAppliedDTO();

			jobAppliedDTO.setId(application.getId().toString());
			jobAppliedDTO.setJobId(application.getJobId());

			jobAppliedDTO.setCreatedAt(application.getCreatedAt());
			jobAppliedDTO.setStatus(application.getStatus());

			String title = jobTitleMap.get(application.getJobId());
			jobAppliedDTO.setTitle(title != null ? title : "Unknown Job Title");

			return jobAppliedDTO;
		});
	}

}
