package com.loihvk23.application_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.application_service.entity.ApplicationEntity;
import java.util.List;


public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
	List<ApplicationEntity> findByCandidateEmailAndJobId(String candidateEmail, Long jobId);
	
	Slice<ApplicationEntity> findByJobIdAndRecruiterEmail(Long jobId, String recruiterEmail, Pageable pageable);

	Slice<ApplicationEntity> findByCandidateEmail(String candidateEmail, Pageable pageable);

	Slice<ApplicationEntity> findByJobIdAndStatusAndRecruiterEmail(Long jobId, String status, String recruiterEmail,
			Pageable pageable);
}
