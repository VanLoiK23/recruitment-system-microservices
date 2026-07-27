package com.loihvk23.job_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedJobDTO {
	private String id;
	private String jobId;
	private JobDTO job;
	private String userEmail;
	private LocalDateTime createdAt;
}
