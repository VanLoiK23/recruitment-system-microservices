package com.loihvk23.notification_service.dto;

import java.util.Map;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CredentialNotificationDTO {
	private String id;

	@Builder.Default
	private String type = "email";

	@NotEmpty(message = "Credential is required")
	private Map<String, Object> credentials;

	private String ownerEmail;
}
