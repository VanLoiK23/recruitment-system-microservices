package com.loihvk23.job_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.job_service.document.UserAppliedJobDocument;

public interface UserAppliedJobRepository extends MongoRepository<UserAppliedJobDocument, String>{
	void deleteByCandidateEmailAndJobId(String candidateEmail, String jobId);
	List<UserAppliedJobDocument> findByCandidateEmailAndJobIdIn(String candidateEmail, List<String> jobId);
	List<UserAppliedJobDocument> findByCandidateEmailAndJobId(String candidateEmail, String jobId);
	List<UserAppliedJobDocument> findByCandidateEmail(String candidateEmail);
	Slice<UserAppliedJobDocument> findByCandidateEmail(String candidateEmail, Pageable pageable);
}
