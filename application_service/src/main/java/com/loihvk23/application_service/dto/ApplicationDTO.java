package com.loihvk23.application_service.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.loihvk23.application_service.ApplicationStatus;
import com.loihvk23.application_service.CVSource;

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

	private String cvTextExtracted;

	@Builder.Default
	private CVSource cvSourceType = CVSource.URL;

	private String cvSnapshotJson;

	@Builder.Default
	private ApplicationStatus status = ApplicationStatus.PENDING;
	
	private String description;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
	private LocalDateTime createdAt;

	private String verdict;

	private Boolean seniorityMismatchWarning;
	
	private String jobTextSnapshot;

	private Double scoreByAI;

	private String aiAnalysisResult;
}
