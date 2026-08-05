package com.loihvk23.application_service.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.application_service.dto.CvDTO;

public interface CvService {
	CvDTO uploadCv(MultipartFile request, String emailCandidate) throws IOException;

	List<CvDTO> getAllCvByCandidate(String candidateEmail);

	Slice<CvDTO> getCvsFollowPage(String candidateEmail, Pageable pageable);

	void deleteCv(String cvId, String emailCandidate) throws IOException;
}
