package com.loihvk23.auth_service.dto;

import java.util.Date;

import lombok.Data;

@Data
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
