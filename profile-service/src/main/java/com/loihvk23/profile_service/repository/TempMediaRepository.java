package com.loihvk23.profile_service.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.document.TempMediaDocument;

public interface TempMediaRepository extends MongoRepository<TempMediaDocument, String> {
	void deleteByFileUrl(String fileUrl);

	void deleteByFileUrlIn(List<String> fileUrls);

	List<TempMediaDocument> findByCreatedAtBefore(LocalDateTime createdAt);
}
