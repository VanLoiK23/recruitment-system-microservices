package com.loihvk23.application_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvDTO {
	private String id;

	private String candidateEmail;

	private String fileName;

	private String fileUrl;

	private LocalDateTime uploadedAt;
}
