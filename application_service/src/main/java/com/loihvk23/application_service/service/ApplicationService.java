package com.loihvk23.application_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;

public interface ApplicationService {
	ApplicationDTO postApplicationApplyJob(ApplicationRequest applicationRequest, String emailCandidate);

	ApplicationDTO updateStatusApplication(Long applicationId, String emailRecruiter, String status);

	ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email);

	void deleteApplicationById(Long applicationId, String emailCandidate);

	Slice<ApplicationDTO> findApplicationsByJob(Long jobId, String emailRecruiter, Pageable pageable);

	Slice<ApplicationDTO> findApplicationsByJobAndStatus(Long jobId, String status, String emailRecruiter,
			Pageable pageable);

	Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable);
}
