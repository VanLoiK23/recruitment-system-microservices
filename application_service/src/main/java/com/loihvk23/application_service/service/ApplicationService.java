package com.loihvk23.application_service.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.dto.request.ScoreResult;
import com.loihvk23.application_service.dto.response.JobApplicationsResponseDTO;

import reactor.core.publisher.Mono;

public interface ApplicationService {
	ApplicationDTO postApplicationApplyJob(ApplicationRequest request, String emailCandidate);

	boolean checkJobApply(String jobId, String emailCandidate);

	ApplicationDTO updateStatusApplication(Long applicationId, String emailRecruiter, String status);
	
	void updateBulkStatusApplication(List<Long> ids, String emailRecruiter, String status);

	ApplicationDTO findDetailByCandidateOrRecruiter(Long applicationId, String email, String role);

	void deleteApplicationById(Long applicationId, String emailCandidate);

	JobApplicationsResponseDTO findApplicationsByJob(String jobId, String emailRecruiter, String status, String query,
			Pageable pageable);

	Slice<ApplicationDTO> findApplicationsOfCandidate(String emailCandidate, Pageable pageable);
	
	ApplicationDTO updateScoreTier1Application(Long appId, ScoreResult scoreResult);
	
	Mono<ApplicationDTO> updateAIResultApplicationDTO(Long applicationId);
}
