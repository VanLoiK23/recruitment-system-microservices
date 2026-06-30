package com.loihvk23.auth_service.controller;

import java.util.Map;

import javax.naming.AuthenticationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.auth_service.config.JwtProvider;
import com.loihvk23.auth_service.dto.UserDTO;
import com.loihvk23.auth_service.dto.request.JwtRequest;
import com.loihvk23.auth_service.dto.request.RegisterLoginRequest;
import com.loihvk23.auth_service.dto.response.JwtResponse;
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
	public ResponseEntity<?> register(@RequestBody @Valid RegisterLoginRequest request) {
		if (request.getFullName() == null || request.getFullName().isEmpty()) {
			throw new IllegalArgumentException("Fullname must not be empty !!");
		}

		if (request.getPassword() != null && request.getPassword().length() < 6) {
			throw new IllegalArgumentException("Password must be at least 6 character long !!");
		}

		if (request.getRole() == null || request.getRole().isEmpty()) {
			throw new IllegalArgumentException("Role must be chosen!!");
		}

		if (request.getRole().equalsIgnoreCase("admin")) {
			throw new IllegalArgumentException("Invalid role. Try again!!");
		}

		UserDTO userDTO = userService.register(request);
		userDTO.setPassword(null);

		return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
	}

	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody @Valid RegisterLoginRequest request) throws AuthenticationException {
		JwtResponse jwtResponse = userService.login(request);

		return ResponseEntity.ok(jwtResponse);
	}

	@PostMapping("refresh")
	public ResponseEntity<?> refreshAccessToken(@RequestBody @Valid JwtRequest request) {

		String token = request.getRefreshToken();

		RefreshToken refreshToken = jwtProvider.verifyExpiration(token);

		String accessToken = jwtProvider.generateAccessTokenFromUser(refreshToken.getUser());

		return ResponseEntity.ok(Map.of("accessToken", accessToken));
	}
}
