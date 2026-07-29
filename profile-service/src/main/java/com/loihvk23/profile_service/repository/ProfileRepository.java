package com.loihvk23.profile_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.document.ProfileDocument;


public interface ProfileRepository extends MongoRepository<ProfileDocument, String>{
	Optional<ProfileDocument> findByEmailCandidate(String emailCandidate);
}
