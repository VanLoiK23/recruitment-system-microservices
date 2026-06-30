package com.loihvk23.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.auth_service.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
	boolean existsByEmail(String email);
	
	Optional<UserEntity> findByEmail(String email);
}
