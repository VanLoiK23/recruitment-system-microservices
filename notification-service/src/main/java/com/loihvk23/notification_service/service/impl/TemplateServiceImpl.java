package com.loihvk23.notification_service.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.loihvk23.notification_service.document.TemplateDocument;
import com.loihvk23.notification_service.dto.TemplateDTO;
import com.loihvk23.notification_service.mapper.TemplateMapper;
import com.loihvk23.notification_service.repository.TemplateRepository;
import com.loihvk23.notification_service.service.TemplateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

	private final TemplateRepository templateRepository;

	private final TemplateMapper mapper;

	@Override
	public Slice<TemplateDTO> findByOwerEmailAndTemplateKey(String email, String templateKey, Pageable pageable) {
		String templateKeySearch = (templateKey == null || templateKey.isBlank()) ? null : templateKey;
		Slice<TemplateDocument> templatesDocumentSlice = templateRepository.searchTemplates(email, templateKeySearch,
				pageable);

		return templatesDocumentSlice.map(mapper::toDTO);
	}

	@Override
	public TemplateDTO saveTemplate(TemplateDTO templateDTO, String email, String action) {
		if ("ADD".equalsIgnoreCase(action)) {
			if (templateRepository.existsByOwnerEmailAndTemplateKey(email, templateDTO.getTemplateKey())) {
				throw new IllegalArgumentException("Template key is exist");
			}
		}

		TemplateDocument templateDocument = templateRepository.findById(templateDTO.getId()).orElse(null);

		mapper.updateDocumentFromDTO(templateDTO, templateDocument);
		if (templateDocument.getCreatedAt() == null) {
			templateDocument.setCreatedAt(LocalDateTime.now());
		}

		TemplateDocument templateSaveDocument = templateRepository.save(templateDocument);

		return mapper.toDTO(templateSaveDocument);
	}

	@Override
	public void deleteTemplate(String id, String email) {
		TemplateDocument templateDocument = templateRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Template doesn't exist"));

		if (!templateDocument.getOwnerEmail().equalsIgnoreCase(email)) {
			throw new AccessDeniedException("You haven't authorize access this resource");
		}

		templateRepository.delete(templateDocument);
	}

}
