package com.loihvk23.job_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.job_service.document.SavedJobDocument;

public interface SavedJobRepository extends MongoRepository<SavedJobDocument, String>{
	void deleteByUserEmailAndJobId(String userEmail, String jobId);
	List<SavedJobDocument> findByUserEmailAndJobId(String userEmail, String jobId);
	Slice<SavedJobDocument> findByUserEmail(String userEmail, Pageable pageable);
}
