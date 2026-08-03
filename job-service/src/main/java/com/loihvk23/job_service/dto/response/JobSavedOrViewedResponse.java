package com.loihvk23.job_service.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSavedOrViewedResponse {
	private String id;
	private String jobId;
	private String title;
	private LocalDateTime createdAt;
	private String status;
}
