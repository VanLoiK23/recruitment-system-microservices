package com.loihvk23.application_service.service;

import java.util.List;

import com.loihvk23.application_service.dto.JobCacheDTO;

public interface JobCacheService {
	JobCacheDTO upsertJob(JobCacheDTO jobCacheDTO);
	
	void deleteJob(String id);
	
	JobCacheDTO findJobById(String id);
	
	List<JobCacheDTO> findJobByRecruiterEmail(String recruiterEmail);
}
