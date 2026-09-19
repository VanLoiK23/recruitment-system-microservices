package com.loihvk23.notification_service.service.impl;

import org.springframework.stereotype.Service;

import com.loihvk23.notification_service.document.CredentialNotificationDocument;
import com.loihvk23.notification_service.dto.CredentialNotificationDTO;
import com.loihvk23.notification_service.mapper.CredentialMapper;
import com.loihvk23.notification_service.repository.CredentialRepository;
import com.loihvk23.notification_service.service.CredentialNotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CredentialNotificationServiceImpl implements CredentialNotificationService {

	private final CredentialRepository credentialRepository;

	private final CredentialMapper mapper;

	@Override
	public CredentialNotificationDTO findByOwnerEmail(String email) {
		CredentialNotificationDocument credentialDocument = credentialRepository.findByOwnerEmail(email).orElse(null);

		return mapper.toDTO(credentialDocument);
	}

	@Override
	public CredentialNotificationDTO saveCredential(CredentialNotificationDTO credentialNotificationDTO, String email) {

		CredentialNotificationDocument credentialDocument = credentialRepository.findByOwnerEmail(email).orElse(null);

		mapper.updateDocumentFromDTO(credentialNotificationDTO, credentialDocument);

		CredentialNotificationDocument credentialNotificationSaved = credentialRepository.save(credentialDocument);

		return mapper.toDTO(credentialNotificationSaved);
	}

}
