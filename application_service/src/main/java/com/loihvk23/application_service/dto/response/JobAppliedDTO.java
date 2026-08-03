package com.loihvk23.application_service.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobAppliedDTO {
	private String id;
	private String jobId;
	private String title;
	private LocalDateTime createdAt;
	private String status;
}
