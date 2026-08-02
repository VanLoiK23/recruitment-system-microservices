package com.loihvk23.application_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.application_service.entity.CvEntity;

public interface CvRepository extends JpaRepository<CvEntity, String> {
	List<CvEntity> findByCandidateEmail(String candidateEmail);

	Page<CvEntity> findByCandidateEmail(String candidateEmail,Pageable pageable);
}
