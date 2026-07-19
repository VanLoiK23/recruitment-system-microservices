package com.loihvk23.auth_service.service;

import javax.naming.AuthenticationException;

import com.loihvk23.auth_service.dto.UserDTO;
import com.loihvk23.auth_service.dto.request.RegisterLoginRequest;
import com.loihvk23.auth_service.dto.response.JwtResponse;

public interface UserService {
	UserDTO register(RegisterLoginRequest request);
	
	JwtResponse login(RegisterLoginRequest request) throws AuthenticationException ;
		
	UserDTO findUserByEmail(String email);
	
	boolean generateOTPAndSendMail(String email);
	
	boolean verifyOTP(String email,String OTP);
	
	boolean generateTokenAndSendMailReset(String email);
	
	boolean resetPassword(String token,String password);
	
	UserDTO findUserById(int id) throws AuthenticationException;
}
