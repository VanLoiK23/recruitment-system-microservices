package com.loihvk23.auth_service.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
	private String token;
	private String password;
}
