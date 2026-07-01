package com.loihvk23.application_service.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobEvent {
	private String id;
	private String recruiterEmail;
	private String status;
}
