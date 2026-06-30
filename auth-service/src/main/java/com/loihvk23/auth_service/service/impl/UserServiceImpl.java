package com.loihvk23.auth_service.service.impl;

import javax.naming.AuthenticationException;

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
	public UserDTO findUserByEmail(String email) throws AuthenticationException {
		UserEntity userEntity = userRepository.findByEmail(email)
				.orElseThrow(() -> new AuthenticationException("User not found"));

		return userMapper.toDTO(userEntity);
	}

	@Override
	public UserDTO findUserById(int id) throws AuthenticationException {
		UserEntity userEntity = userRepository.findById((long) id)
				.orElseThrow(() -> new AuthenticationException("User not found"));

		return userMapper.toDTO(userEntity);
	}

}
