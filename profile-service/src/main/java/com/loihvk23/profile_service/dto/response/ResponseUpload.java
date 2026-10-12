package com.loihvk23.profile_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseUpload {
	private String url;

	private String newCompanyId;
}
