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
public class UserAppliedJobDTO {
	private String id;
	private String candidateEmail;
	private String jobId;
	private String status;
	private LocalDateTime createdAt;
}
