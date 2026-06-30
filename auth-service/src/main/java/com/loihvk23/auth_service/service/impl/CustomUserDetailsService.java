package com.loihvk23.auth_service.service.impl;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.loihvk23.auth_service.entity.UserEntity;
import com.loihvk23.auth_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		UserEntity userEntity = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found !!!"));

		// role must be start by char 'ROLE_'
		return User.withUsername(email).password(userEntity.getPassword())
				.authorities("ROLE_" + userEntity.getRole().toUpperCase()).build();
	}

}
