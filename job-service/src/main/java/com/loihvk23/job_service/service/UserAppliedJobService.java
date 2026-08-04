package com.loihvk23.job_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.UserAppliedJobDTO;
import com.loihvk23.job_service.dto.response.JobManagementResponse;

public interface UserAppliedJobService {
	void saveAppliedJob(UserAppliedJobDTO userAppliedJobDTO);
	
	void deleteAppliedJob(String jobId, String candidateEmail);

	boolean checkJobApplied(String jobId, String candidateEmail);

	Slice<JobManagementResponse> findAppliedJobsByUser(String candidateEmail,Pageable pageable);
}
