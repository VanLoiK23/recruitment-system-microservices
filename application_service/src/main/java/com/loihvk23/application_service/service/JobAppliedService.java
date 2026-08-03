package com.loihvk23.application_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.response.JobAppliedDTO;

public interface JobAppliedService {
	Slice<JobAppliedDTO> findJobAppliedByCandidate(String emailCandidate,Pageable pageable);
}
