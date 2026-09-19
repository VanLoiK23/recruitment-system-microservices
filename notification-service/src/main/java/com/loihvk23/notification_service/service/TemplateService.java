package com.loihvk23.notification_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.notification_service.dto.TemplateDTO;

public interface TemplateService {
	Slice<TemplateDTO> findByOwerEmailAndTemplateKey(String email, String templateKey, Pageable pageable);

	TemplateDTO saveTemplate(TemplateDTO templateDTO, String email, String action);
	
	void deleteTemplate(String id, String email);
}
