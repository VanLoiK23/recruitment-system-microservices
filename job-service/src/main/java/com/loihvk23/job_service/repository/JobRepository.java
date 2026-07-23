package com.loihvk23.job_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.loihvk23.job_service.document.JobDocument;

@Repository
public interface JobRepository extends MongoRepository<JobDocument, String> {
	List<JobDocument> findByRecruiterEmailAndTitleAndLocationAndStatus(String recruiterEmail, String title, String location, String status);
	
	Slice<JobDocument> findByTechnologies(List<String> technologies, Pageable pageable);
	
	Slice<JobDocument> findByRecruiterEmail(String recruiterEmail, Pageable pageable);
	
	Slice<JobDocument> findByMinSalaryGreaterThanEqual(Double minSalary, Pageable pageable);

	Slice<JobDocument> findByMaxSalaryLessThanEqual(Double maxSalary, Pageable pageable);

	Slice<JobDocument> findByMinSalaryGreaterThanEqualAndMaxSalaryLessThanEqual(Double minSalary, Double maxSalary, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContains(String technology, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContainsAndJobLevel(String technology, String jobLevel, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContainsAndJobLevelAndLocation(String technology, String jobLevel, String location, Pageable pageable);
	
	Slice<JobDocument> findByTechnologiesContainsOrJobLevel(String technologies, String jobLevel);
}
