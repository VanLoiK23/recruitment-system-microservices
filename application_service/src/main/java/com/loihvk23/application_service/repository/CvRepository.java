package com.loihvk23.application_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.loihvk23.application_service.entity.CvEntity;

public interface CvRepository extends JpaRepository<CvEntity, String> {
	List<CvEntity> findByCandidateEmail(String candidateEmail);

	Slice<CvEntity> findByCandidateEmail(String candidateEmail, Pageable pageable);
}
