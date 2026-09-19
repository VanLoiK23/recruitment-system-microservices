package com.loihvk23.application_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UpdateBulkStatusRequest {
	@NotEmpty(message = "application's ID is required")
	private List<Long> ids;

	@NotEmpty(message = "status updated is required")
	private String status;
}
