package com.loihvk23.job_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.response.JobSavedOrViewedResponse;

public interface SavedJobService {
	void saveJob(String jobId, String userEmail);

	boolean checkJobIsSaved(String jobId, String userEmail);

	Slice<JobSavedOrViewedResponse> findSavedJobsByUser(String userEmail,Pageable pageable);
}
