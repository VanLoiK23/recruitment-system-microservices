package com.loihvk23.job_service.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.UserAppliedJobDTO;
import com.loihvk23.job_service.dto.response.JobManagementResponse;

public interface UserAppliedJobService {
	UserAppliedJobDTO saveAppliedJob(UserAppliedJobDTO userAppliedJobDTO);
	
	void updateBulkStatus(List<UserAppliedJobDTO> userAppliedJobDTOs);
	
	void deleteAppliedJob(String jobId, String candidateEmail);

	boolean checkJobApplied(String jobId, String candidateEmail);

	Slice<JobManagementResponse> findAppliedJobsByUser(String candidateEmail,Pageable pageable);
}
