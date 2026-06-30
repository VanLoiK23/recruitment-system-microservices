package com.loihvk23.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.auth_service.entity.RefreshToken;
import com.loihvk23.auth_service.entity.UserEntity;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
	Optional<RefreshToken> findByToken(String token);
	
	void deleteByUser(UserEntity user);
}
