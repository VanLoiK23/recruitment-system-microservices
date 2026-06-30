package com.loihvk23.job_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.loihvk23.job_service.document.JobDocument;

@Repository
public interface JobRepository extends MongoRepository<JobDocument, String> {
	Slice<JobDocument> findByRecruiterEmail(String recruiterEmail, Pageable pageable);
	
	Slice<JobDocument> findByMinSalaryGreaterThanEqual(Double minSalary, Pageable pageable);

	Slice<JobDocument> findByMaxSalaryLessThanEqual(Double maxSalary, Pageable pageable);

	Slice<JobDocument> findByMinSalaryGreaterThanEqualAndMaxSalaryLessThanEqual(Double minSalary, Double maxSalary, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContains(String technology, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContainsAndJobLevel(String technology, String jobLevel, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContainsAndJobLevelAndLocation(String technology, String jobLevel, String location, Pageable pageable);
}
