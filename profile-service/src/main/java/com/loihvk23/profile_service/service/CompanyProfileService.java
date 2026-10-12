package com.loihvk23.profile_service.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.profile_service.dto.CompanyProfileDTO;
import com.loihvk23.profile_service.dto.response.ResponseUpload;

public interface CompanyProfileService {
	CompanyProfileDTO saveProfile(CompanyProfileDTO companyProfileDTO, String ownerEmail, String role) throws IOException,IllegalArgumentException;

	CompanyProfileDTO findById(String id);
	
	List<String> findNameCompaniesByOwner(String ownerEmail);

	Slice<CompanyProfileDTO> findAllCompanies(Pageable pageable);

	Slice<CompanyProfileDTO> findMyCompanies(String ownerEmail, Pageable pageable);
	
	ResponseUpload uploadMedia(MultipartFile file, String type, String companyId)  throws IOException;
}
