package com.loihvk23.notification_service.repository;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.loihvk23.notification_service.document.TemplateDocument;

@Repository
public interface TemplateRepository extends MongoRepository<TemplateDocument, String>{
	Slice<TemplateDocument> findByOwnerEmail(String ownerEmail, Pageable pageable);
	
	@Query("{ 'ownerEmail': ?0, 'templateKey': { $regex: ?#{ [1] == null ? '.*' : [1] }, $options: 'i' } }")
    Slice<TemplateDocument> searchTemplates(String ownerEmail, String templateKey, Pageable pageable);
	
	Optional<TemplateDocument> findByOwnerEmailAndTemplateKey(String ownerEmail, String templateKey);
	
	boolean existsByOwnerEmailAndTemplateKey(String ownerEmail, String templateKey);
}
