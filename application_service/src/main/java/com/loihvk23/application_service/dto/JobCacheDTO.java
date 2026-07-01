package com.loihvk23.application_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobCacheDTO {

	private String id;
	private String recruiterEmail;
	private String status;
}
