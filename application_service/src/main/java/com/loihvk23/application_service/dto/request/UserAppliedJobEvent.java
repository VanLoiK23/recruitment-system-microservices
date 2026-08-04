package com.loihvk23.application_service.dto.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAppliedJobEvent {
	private String id;
	private String candidateEmail;
	private String jobId;
	private String status;
	private LocalDateTime createdAt;
}
