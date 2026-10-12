package com.loihvk23.profile_service.repository;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.document.CompanyDocument;
import java.util.List;

public interface CompanyProfileRepository extends MongoRepository<CompanyDocument, String> {
	Optional<CompanyDocument> findByIdAndOwnerEmail(String id, String ownerEmail);

	Slice<CompanyDocument> findByOwnerEmail(String ownerEmail, Pageable pageable);

	List<CompanyDocument> findByOwnerEmail(String ownerEmail);
}
