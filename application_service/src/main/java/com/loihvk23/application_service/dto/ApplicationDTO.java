package com.loihvk23.application_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDTO {
	private Long id;

	private Long jobId;

	private String candidateEmail;
	
	private String recruiterEmail;

	private String cvUrl;

	private String status;

	private LocalDateTime createdAt;
}
