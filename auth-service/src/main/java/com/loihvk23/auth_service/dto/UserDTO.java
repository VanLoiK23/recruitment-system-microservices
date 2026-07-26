package com.loihvk23.auth_service.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private Integer id;
	
	private String email;
	
	private String password;
	
	private String fullName;
	
	private String role;
	
	private Date createAt;
	
	private String firstName;
	
	private String lastName;
	
}
