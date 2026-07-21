package com.loihvk23.auth_service.dto.response;

import com.loihvk23.auth_service.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginSuccessResponse {
	private String accessToken;
	private UserDTO user;
}
