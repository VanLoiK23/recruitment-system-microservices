package com.loihvk23.auth_service.service.impl;

import java.security.SecureRandom;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.naming.AuthenticationException;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.loihvk23.auth_service.config.JwtProvider;
import com.loihvk23.auth_service.dto.UserDTO;
import com.loihvk23.auth_service.dto.request.RegisterLoginRequest;
import com.loihvk23.auth_service.dto.response.JwtResponse;
import com.loihvk23.auth_service.entity.UserEntity;
import com.loihvk23.auth_service.mapper.UserMapper;
import com.loihvk23.auth_service.repository.UserRepository;
import com.loihvk23.auth_service.service.EmailService;
import com.loihvk23.auth_service.service.UserService;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;

	private final UserMapper userMapper;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;

	private final JwtProvider jwtProvider;

	private final RedisTemplate<String, Object> redisTemplate;

	private final EmailService emailService;

	@Override
	public UserDTO register(RegisterLoginRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new EntityExistsException("Email has already in the system. Try again !!");
		}
		UserEntity userEntity = userMapper.toEntity(request);

		userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));

		return userMapper.toDTO(userRepository.save(userEntity));
	}

	@Override
	public JwtResponse login(RegisterLoginRequest request) throws AuthenticationException {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		String accessToken = jwtProvider.generateAccessToken(authentication);
		String refreshToken = jwtProvider.createRefreshToken(request.getEmail());

		JwtResponse jwtResponse = JwtResponse.builder().accessToken(accessToken).refreshToken(refreshToken).build();

		return jwtResponse;
	}

	@Override
	public UserDTO findUserByEmail(String email) {
		UserEntity userEntity = userRepository.findByEmail(email).orElse(null);

		return userMapper.toDTO(userEntity);
	}

	@Override
	public UserDTO findUserById(int id) throws AuthenticationException {
		UserEntity userEntity = userRepository.findById((long) id)
				.orElseThrow(() -> new AuthenticationException("User not found"));

		return userMapper.toDTO(userEntity);
	}

	@Override
	public boolean generateOTPAndSendMail(String email) {
		String key = "OTP_" + email;

		SecureRandom random = new SecureRandom();

		String otp = String.format("%06d", random.nextInt(1000000));

		redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);

		return emailService.sendOTPEmail(email, otp);
	}

	@Override
	public boolean verifyOTP(String email, String OTP) {
		String key = "OTP_" + email;

		String realOTP = (String) redisTemplate.opsForValue().get(key);

		if (!realOTP.equals(OTP)) {
			return false;
		}
		redisTemplate.delete(key);

		return true;
	}

	@Override
	public boolean generateTokenAndSendMailReset(String email) {
		String resetToken = UUID.randomUUID().toString();

		redisTemplate.opsForValue().set("RESET_" + resetToken, email, 15, TimeUnit.MINUTES);

		return emailService.sendResetEmail(email, resetToken);
	}

	@Override
	public boolean resetPassword(String token, String password) {
		String key = "RESET_" + token;

		String email = (String) redisTemplate.opsForValue().get(key);

		if (email == null || email.isBlank()) {
			return false;
		}
		
		UserEntity userEntity = userRepository.findByEmail(email).orElse(null);
		
		if(userEntity == null) {
			return false;
		}
		userEntity.setPassword(passwordEncoder.encode(password));
		
		userRepository.save(userEntity);
		
		redisTemplate.delete(key);

		return true;
	}
}
