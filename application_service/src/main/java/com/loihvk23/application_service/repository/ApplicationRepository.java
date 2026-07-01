package com.loihvk23.application_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.application_service.entity.ApplicationEntity;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
	List<ApplicationEntity> findByCandidateEmailAndJobId(String candidateEmail, String jobId);

	Slice<ApplicationEntity> findByJobId(String jobId, Pageable pageable);

	Slice<ApplicationEntity> findByCandidateEmail(String candidateEmail, Pageable pageable);

	Slice<ApplicationEntity> findByJobIdAndStatus(String jobId, String status, Pageable pageable);
}
