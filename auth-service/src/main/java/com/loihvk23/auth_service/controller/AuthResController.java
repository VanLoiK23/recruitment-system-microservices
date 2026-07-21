package com.loihvk23.auth_service.controller;

import java.util.Map;

import javax.naming.AuthenticationException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.auth_service.config.JwtProvider;
import com.loihvk23.auth_service.dto.UserDTO;
import com.loihvk23.auth_service.dto.request.LoginRequest;
import com.loihvk23.auth_service.dto.request.RegisterRequest;
import com.loihvk23.auth_service.dto.request.ResetPasswordRequest;
import com.loihvk23.auth_service.dto.request.ValidateRequestDTO;
import com.loihvk23.auth_service.dto.response.JwtResponse;
import com.loihvk23.auth_service.dto.response.LoginSuccessResponse;
import com.loihvk23.auth_service.dto.response.MessageResponse;
import com.loihvk23.auth_service.entity.RefreshToken;
import com.loihvk23.auth_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("authResController")
@RequiredArgsConstructor
@RequestMapping("/api/auth/")
public class AuthResController {

	private final UserService userService;

	private final JwtProvider jwtProvider;

	@PostMapping("register")
	public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
		if (request.getRole().equalsIgnoreCase("admin")) {
			throw new IllegalArgumentException("Invalid role. Try again!!");
		}

		UserDTO userDTO = userService.register(request);
		userDTO.setPassword(null);

		return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
	}

	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) throws AuthenticationException {
		JwtResponse jwtResponse = userService.login(request);

		long cookieMaxAge = request.isRemember() ? (7 * 24 * 60 * 60) : -1; // -1 convert to cookie session

		ResponseCookie springCookie = ResponseCookie.from("refresh_token", jwtResponse.getRefreshToken()).httpOnly(true)
				.path("/").secure(false) // apply for https while apply
				.maxAge(cookieMaxAge).sameSite("Strict") // avoid to attack csrf
				.build();

		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, springCookie.toString())
				.body(new LoginSuccessResponse(jwtResponse.getAccessToken(), jwtResponse.getUser()));
	}

	@PostMapping("check-duplicate-email")
	public ResponseEntity<?> checkDuplicateEmail(@RequestBody @Valid ValidateRequestDTO request) {
		UserDTO userDTO = userService.findUserByEmail(request.getEmail());

		return ResponseEntity.ok(Map.of("isDuplicate", userDTO != null));
	}

	@PostMapping("send-otp-check-email")
	public ResponseEntity<?> sendOTP(@RequestBody @Valid ValidateRequestDTO request) {
		boolean isSuccess = userService.generateOTPAndSendMail(request.getEmail());

		return ResponseEntity.ok(Map.of("isSuccess", isSuccess));
	}

	@PostMapping("verify-otp")
	public ResponseEntity<?> confirmEmailValid(@RequestBody @Valid ValidateRequestDTO request) {
		if (request.getOtp() == null || request.getOtp().isBlank()) {
			throw new IllegalArgumentException("OTP is required !");
		}

		boolean success = userService.verifyOTP(request.getEmail(), request.getOtp());

		return ResponseEntity.ok(Map.of("success", success));
	}

	@PostMapping("forgot-password")
	public ResponseEntity<?> sendEmailForgotPassword(@RequestBody @Valid ValidateRequestDTO request) {

		boolean success = userService.generateTokenAndSendMailReset(request.getEmail());

		return ResponseEntity.ok(Map.of("success", success));
	}

	@PostMapping("reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {

		boolean success = userService.resetPassword(request.getToken(), request.getPassword());

		return ResponseEntity.ok(Map.of("success", success));
	}

	@PostMapping("refresh")
	public ResponseEntity<?> refreshAccessToken(@CookieValue(name = "refresh_token") String token) {

		RefreshToken refreshToken = jwtProvider.verifyExpiration(token);

		String accessToken = jwtProvider.generateAccessTokenFromUser(refreshToken.getUser());

		return ResponseEntity.ok(Map.of("accessToken", accessToken));
	}

	@PostMapping("logout")
	public ResponseEntity<?> logout() {

		ResponseCookie springCookie = ResponseCookie.from("refresh_token", "").httpOnly(true).path("/").maxAge(0)
				.secure(false).sameSite("Strict").build();

		MessageResponse response = MessageResponse.builder().success(true).message("Logout successful").build();

		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, springCookie.toString()).body(response);
	}
}
