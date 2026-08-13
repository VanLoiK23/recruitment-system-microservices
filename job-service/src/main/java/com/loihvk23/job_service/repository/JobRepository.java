package com.loihvk23.job_service.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.loihvk23.job_service.document.JobDocument;

@Repository
public interface JobRepository extends MongoRepository<JobDocument, String> {
	boolean existsByRecruiterEmailAndTitleAndLocationAndDeadlineAfter(String recruiterEmail, String title,
			String location, LocalDateTime now);

	Optional<JobDocument> findFirstByRecruiterEmailAndStatus(String recruiterEmail, String status);

	Slice<JobDocument> findByTechnologiesInAndIdNotAndStatusAndDeadlineAfter(List<String> technologies, String jobId,
			String status, LocalDateTime now, Pageable pageable);

	Slice<JobDocument> findByRecruiterEmailAndStatusIsNot(String recruiterEmail, String status, Pageable pageable);

	Slice<JobDocument> findByRecruiterEmailAndTitleContainingIgnoreCaseAndStatusIsNot(String recruiterEmail,
			String title, String status, Pageable pageable);

	Slice<JobDocument> findByRecruiterEmailAndStatus(String recruiterEmail, String status, Pageable pageable);

	Slice<JobDocument> findByRecruiterEmailAndTitleContainingIgnoreCaseAndStatus(String recruiterEmail, String title,
			String status, Pageable pageable);

	Slice<JobDocument> findByMinSalaryGreaterThanEqual(Double minSalary, Pageable pageable);

	Slice<JobDocument> findByMaxSalaryLessThanEqual(Double maxSalary, Pageable pageable);

	Slice<JobDocument> findByMinSalaryGreaterThanEqualAndMaxSalaryLessThanEqual(Double minSalary, Double maxSalary,
			Pageable pageable);

	Slice<JobDocument> findByTechnologiesContains(String technology, Pageable pageable);

	Slice<JobDocument> findByTechnologiesContainsAndJobLevel(String technology, String jobLevel, Pageable pageable);

	Slice<JobDocument> findByTechnologiesContainsAndJobLevelAndLocation(String technology, String jobLevel,
			String location, Pageable pageable);

	Slice<JobDocument> findByTechnologiesContainsOrJobLevel(String technologies, String jobLevel);

	long countByRecruiterEmail(String recruiterEmail);

	long countByRecruiterEmailAndTitleContainingIgnoreCaseAndStatus(String recruiterEmail, String title, String status);

	long countByRecruiterEmailAndTitleContainingIgnoreCaseAndStatusIsNot(String recruiterEmail, String title,
			String status);

	long countByRecruiterEmailAndStatus(String recruiterEmail, String status);
}
