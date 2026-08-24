package com.loihvk23.profile_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.document.CandidateProfileDocument;


public interface CandidateProfileRepository extends MongoRepository<CandidateProfileDocument, String>{
	Optional<CandidateProfileDocument> findByEmailCandidate(String emailCandidate);
}
