package com.loihvk23.application_service.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.CvDTO;

public interface CvService {
	CvDTO save(CvDTO cvDTO);
	
	List<CvDTO> getAllCvByCandidate(String candidateEmail);
	
	Slice<CvDTO> getCvsFollowPage(String candidateEmail,Pageable pageable);
	
	void deleteCv(String cvId, String emailCandidate);
}
