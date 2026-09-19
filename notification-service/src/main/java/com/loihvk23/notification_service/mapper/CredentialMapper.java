package com.loihvk23.notification_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.notification_service.document.CredentialNotificationDocument;
import com.loihvk23.notification_service.dto.CredentialNotificationDTO;

@Mapper(componentModel = "spring")
public interface CredentialMapper {

	public CredentialNotificationDTO toDTO(CredentialNotificationDocument credentialNotificationDocument);

	public CredentialNotificationDocument toDocument(CredentialNotificationDTO credentialNotificationDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "ownerEmail", ignore = true)
	void updateDocumentFromDTO(CredentialNotificationDTO dto, @MappingTarget CredentialNotificationDocument document);
}
