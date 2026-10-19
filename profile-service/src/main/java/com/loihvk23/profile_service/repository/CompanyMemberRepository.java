package com.loihvk23.profile_service.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.profile_service.CompanyMemberStatus;
import com.loihvk23.profile_service.document.CompanyMemberDocument;

public interface CompanyMemberRepository extends MongoRepository<CompanyMemberDocument, String> {
	Slice<CompanyMemberDocument> findByCompanyIdAndStatus(String companyId, CompanyMemberStatus status,
			Pageable pageable);

	Optional<CompanyMemberDocument> findByRecruiterEmailAndCompanyId(String recruiterEmail, String companyId);
	
	boolean existsByRecruiterEmailAndCompanyId(String recruiterEmail, String companyId);

	List<CompanyMemberDocument> findByRecruiterEmail(String recruiterEmail);
}
