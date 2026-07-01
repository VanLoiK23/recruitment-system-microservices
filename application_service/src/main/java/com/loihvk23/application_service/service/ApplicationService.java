package com.loihvk23.application_service.service;

import java.io.IOException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;

public interface ApplicationService {
	ApplicationDTO postApplicationApplyJob(ApplicationRequest request, MultipartFile file, String emailCandidate) throws IOException;

	ApplicationDTO updateStatusApplication(Long applicationId, String emailRecruiter, String status);

	ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email,String role);

	void deleteApplicationById(Long applicationId, String emailCandidate);

	Slice<ApplicationDTO> findApplicationsByJob(String jobId, String emailRecruiter, Pageable pageable);

	Slice<ApplicationDTO> findApplicationsByJobAndStatus(String jobId, String status, String emailRecruiter,
			Pageable pageable);

	Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable);
}
