package com.loihvk23.application_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.loihvk23.application_service.dto.JobCacheDTO;
import com.loihvk23.application_service.entity.JobCacheEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.mapper.JobCacheMapper;
import com.loihvk23.application_service.repository.JobCacheRepository;
import com.loihvk23.application_service.service.JobCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobCacheServiceImpl implements JobCacheService {
	private final JobCacheRepository jobCacheRepository;

	private final JobCacheMapper jobCacheMapper;

	@Override
	public JobCacheDTO upsertJob(JobCacheDTO jobCacheDTO) {
		JobCacheEntity jobCacheEntity = jobCacheRepository.save(jobCacheMapper.toEntity(jobCacheDTO));

		return jobCacheMapper.toDTO(jobCacheEntity);
	}

	@Override
	public void deleteJob(String id) {
		jobCacheRepository.deleteById(id);
	}

	@Override
	public JobCacheDTO findJobById(String id) {
		JobCacheEntity jobCacheEntity = jobCacheRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("The Job doesn't exist. Try again !!"));

		return jobCacheMapper.toDTO(jobCacheEntity);
	}

	@Override
	public List<JobCacheDTO> findJobByRecruiterEmail(String recruiterEmail) {
		List<JobCacheEntity> jobCacheEntities = jobCacheRepository.findByRecruiterEmail(recruiterEmail);

		List<JobCacheDTO> jobCacheDTOs = jobCacheEntities.stream().map(jobCacheMapper::toDTO)
				.collect(Collectors.toList());

		return jobCacheDTOs;
	}

}
