package com.loihvk23.notification_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.loihvk23.notification_service.document.CredentialNotificationDocument;


@Repository
public interface CredentialRepository extends MongoRepository<CredentialNotificationDocument, String>{
	Optional<CredentialNotificationDocument> findByOwnerEmail(String ownerEmail);
	
	boolean existsByOwnerEmail(String ownerEmail);
}
