package com.loihvk23.notification_service.document;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("credentials")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CredentialNotificationDocument {
	@Id
	private String id;

	private String type;

	private Map<String, Object> credentials;

	private String ownerEmail;
}
