package com.loihvk23.application_service.service;

import java.util.List;

import com.loihvk23.application_service.dto.CvDTO;

public interface CvService {
	CvDTO save(CvDTO cvDTO);
	
	List<CvDTO> getCvs(String candidateEmail);
}
