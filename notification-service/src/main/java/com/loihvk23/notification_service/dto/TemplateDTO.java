package com.loihvk23.notification_service.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TemplateDTO {
	private String id;

	@NotBlank(message = "Template key is required")
	@Size(max = 100, message = "Template key must not exceed 100 characters")
	@Pattern(regexp = "^[A-Z_]+$", message = "Template key must contain only uppercase letters and underscores")
	private String templateKey;

	@NotBlank(message = "Subject is required")
	@Size(max = 255, message = "Subject must not exceed 255 characters")
	private String subject;

	@NotBlank(message = "HTML content is required")
	private String htmlContent;

	@Size(max = 500, message = "Description must not exceed 500 characters")
	private String description;

	private String ownerEmail;

	private LocalDateTime createdAt;
}
