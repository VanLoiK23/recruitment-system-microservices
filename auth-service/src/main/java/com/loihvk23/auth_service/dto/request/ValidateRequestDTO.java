package com.loihvk23.auth_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidateRequestDTO {
	@NotBlank(message = "Email must not be empty !!")
	@Email(message = "Not correct format email. Try again !!")
	private String email;
	
	private String otp;
}
