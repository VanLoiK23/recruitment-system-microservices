package com.loihvk23.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JwtRequest {
	@NotBlank(message = "Token must not be empty")
	private String refreshToken;
}
