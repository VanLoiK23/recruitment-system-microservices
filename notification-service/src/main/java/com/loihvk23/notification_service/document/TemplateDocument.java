package com.loihvk23.notification_service.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("templates")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(name = "tech_email_key_idx", def = "{'templateKey': 1, 'ownerEmail': 1}")
public class TemplateDocument {
	@Id
	private String id;

	@Indexed
	private String templateKey;

	private String subject;

	private String htmlContent;

	private String description;

	@Indexed
	private String ownerEmail;
	
	private LocalDateTime createdAt;
}
