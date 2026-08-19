package com.loihvk23.application_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.loihvk23.application_service.entity.ApplicationEntity;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
	List<ApplicationEntity> findByCandidateEmailAndJobId(String candidateEmail, String jobId);

	Slice<ApplicationEntity> findByJobId(String jobId, Pageable pageable);

	Slice<ApplicationEntity> findByCandidateEmail(String candidateEmail, Pageable pageable);

	Slice<ApplicationEntity> findByJobIdAndStatus(String jobId, String status, Pageable pageable);

	boolean existsByCandidateEmailAndJobId(String candidateEmail, String jobId);

	long countByJobIdAndScoreByAIGreaterThanEqual(String jobId, int score);
	
	long countByJobIdAndScoreByAIIsNull(String jobId);

	long countByJobId(String jobId);

	@Query("SELECT a FROM ApplicationEntity a " + "WHERE a.jobId = :jobId " + "AND (:st IS NULL OR a.status = :st) "
			+ "AND (:name IS NULL OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%')))")
	Slice<ApplicationEntity> findByJobIdAndStatusAndNameCandidate(@Param("jobId") String jobId,
			@Param("st") String status, @Param("name") String name, Pageable pageable);
}
