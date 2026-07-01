package com.loihvk23.application_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.application_service.entity.JobCacheEntity;

public interface JobCacheRepository extends JpaRepository<JobCacheEntity, String> {
	List<JobCacheEntity> findByRecruiterEmail(String recruiterEmail);	
}
