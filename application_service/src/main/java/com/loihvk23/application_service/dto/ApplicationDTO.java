package com.loihvk23.application_service.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

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

	private String jobId;

	private String fullName;

	private String phone;

	private String candidateEmail;

	private String cvUrl;

	private String status;

	private String description;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
	private LocalDateTime createdAt;

	@Builder.Default
	private Integer scoreByAI = 0;
}
