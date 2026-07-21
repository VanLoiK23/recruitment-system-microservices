package com.loihvk23.auth_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
	@NotBlank(message = "Email must not be empty !!")
	@Email(message = "Not correct format email. Try again !!")
	private String email;
	
	@NotBlank(message = "Password must not be empty !!")
	@Size(min = 6, message = "Password must be at least 6 character long !!")
	private String password;
	
	@NotBlank(message = "Fullname is required")
	private String fullName;
	
	@NotBlank(message = "Role must be chosen!!")
	private String role;
}
