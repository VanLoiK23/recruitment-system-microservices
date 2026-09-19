package com.loihvk23.notification_service.service;

import com.loihvk23.notification_service.dto.CredentialNotificationDTO;

public interface CredentialNotificationService {
	CredentialNotificationDTO findByOwnerEmail(String email);

	CredentialNotificationDTO saveCredential(CredentialNotificationDTO credentialNotificationDTO, String email);
}
