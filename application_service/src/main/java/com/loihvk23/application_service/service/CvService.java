package com.loihvk23.application_service.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.loihvk23.application_service.dto.CvDTO;

public interface CvService {
	CvDTO save(CvDTO cvDTO);
	
	List<CvDTO> getAllCvByCandidate(String candidateEmail);
	
	Page<CvDTO> getCvsFollowPage(String candidateEmail,Pageable pageable);
	
	void deleteCv(String cvId, String emailCandidate);
}
