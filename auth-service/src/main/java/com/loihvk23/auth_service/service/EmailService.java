package com.loihvk23.auth_service.service;

public interface EmailService {
	boolean sendOTPEmail(String toEmail, String OTP);
	
	boolean sendResetEmail(String toEmail, String token);
}
