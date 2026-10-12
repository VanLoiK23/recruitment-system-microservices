package com.loihvk23.profile_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.profile_service.dto.CompanyMemberDTO;

public interface CompanyMemberService {
	CompanyMemberDTO joinCompany(CompanyMemberDTO companyMemberDTO, String recruiterEmail);

	CompanyMemberDTO findById(String id);

	Slice<CompanyMemberDTO> findMemberOfCompany(String companyId, String email, String role, Pageable pageable,
			String memberStatus);

	CompanyMemberDTO updateStaus(String id, String newStatus, String ownerEmail, String role);
}
