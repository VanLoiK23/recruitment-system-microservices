package com.loihvk23.application_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.dto.response.JobApplicationsResponseDTO;

public interface ApplicationService {
	ApplicationDTO postApplicationApplyJob(ApplicationRequest request, String emailCandidate);

	boolean checkJobApply(String jobId, String emailCandidate);

	ApplicationDTO updateStatusApplication(Long applicationId, String emailRecruiter, String status);

	ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email, String role);

	void deleteApplicationById(Long applicationId, String emailCandidate);

	JobApplicationsResponseDTO findApplicationsByJob(String jobId, String emailRecruiter, String status, String query, Pageable pageable);

	Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable);

}
