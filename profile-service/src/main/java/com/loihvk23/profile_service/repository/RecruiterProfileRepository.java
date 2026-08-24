package com.loihvk23.profile_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.document.RecruiterProfileDocument;

public interface RecruiterProfileRepository extends MongoRepository<RecruiterProfileDocument, String> {
	Optional<RecruiterProfileDocument> findByEmailRecruiter(String emailRecruiter);
}
