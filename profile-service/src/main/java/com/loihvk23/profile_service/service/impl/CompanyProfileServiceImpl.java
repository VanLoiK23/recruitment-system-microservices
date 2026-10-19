package com.loihvk23.profile_service.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.profile_service.CompanyMemberRole;
import com.loihvk23.profile_service.CompanyMemberStatus;
import com.loihvk23.profile_service.document.CompanyDocument;
import com.loihvk23.profile_service.document.CompanyMemberDocument;
import com.loihvk23.profile_service.dto.CompanyMemberDTO;
import com.loihvk23.profile_service.dto.CompanyProfileDTO;
import com.loihvk23.profile_service.dto.response.CompaniesInfoResponse;
import com.loihvk23.profile_service.dto.response.ResponseUpload;
import com.loihvk23.profile_service.mapper.CompanyMemberMapper;
import com.loihvk23.profile_service.mapper.CompanyProfileMapper;
import com.loihvk23.profile_service.repository.CompanyMemberRepository;
import com.loihvk23.profile_service.repository.CompanyProfileRepository;
import com.loihvk23.profile_service.repository.TempMediaRepository;
import com.loihvk23.profile_service.service.CompanyProfileService;
import com.loihvk23.profile_service.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyProfileServiceImpl implements CompanyProfileService {
	private final CompanyProfileRepository companyProfileRepository;

	private final CompanyProfileMapper mapper;

	private final CompanyMemberMapper memberMapper;

	@Autowired
	@Lazy
	private FileStorageService fileStorageService;

	private final TempMediaRepository tempMediaRepository;

	private final CompanyMemberRepository companyMemberRepository;

	@Override
	@Transactional
	public CompanyProfileDTO saveProfile(CompanyProfileDTO companyProfileDTO, String ownerEmail, String role)
			throws IOException {

		if (!isAuthorization(role)) {
			throw new IllegalArgumentException("You are not authorized to access this resource");
		}

		companyProfileDTO.setOwnerEmail(ownerEmail);

		if ((companyProfileDTO.getId() == null || companyProfileDTO.getId().isBlank())
				|| companyProfileDTO.getIsNewCompany() != null && companyProfileDTO.getIsNewCompany()) {
			CompanyDocument newDoc = companyProfileRepository.save(mapper.toDocument(companyProfileDTO));
			removeConfirmedUrlsFromTemp(companyProfileDTO);
			return mapper.toDTO(newDoc);
		}

		String companyId = companyProfileDTO.getId();
		CompanyDocument oldProfile = companyProfileRepository.findByIdAndOwnerEmail(companyId, ownerEmail)
				.orElse(new CompanyDocument());

		List<String> oldUrlsToDelete = new ArrayList<>();

		if (hasChanged(oldProfile.getLogoUrl(), companyProfileDTO.getLogoUrl())) {
			oldUrlsToDelete.add(oldProfile.getLogoUrl());
		}
		if (hasChanged(oldProfile.getCoverImageUrl(), companyProfileDTO.getCoverImageUrl())) {
			oldUrlsToDelete.add(oldProfile.getCoverImageUrl());
		}
		if (hasChanged(oldProfile.getBusinessLicenseUrl(), companyProfileDTO.getBusinessLicenseUrl())) {
			oldUrlsToDelete.add(oldProfile.getBusinessLicenseUrl());
		}

		List<String> oldGallery = oldProfile.getGalleryImages() != null ? oldProfile.getGalleryImages()
				: new ArrayList<>();
		List<String> newGallery = companyProfileDTO.getGalleryImages() != null ? companyProfileDTO.getGalleryImages()
				: new ArrayList<>();

		for (String oldImg : oldGallery) {
			if (!newGallery.contains(oldImg)) {
				oldUrlsToDelete.add(oldImg);
			}
		}

		mapper.updateDocumentFromDTO(companyProfileDTO, oldProfile);
		CompanyDocument companySaveDocument = companyProfileRepository.save(oldProfile);

		// add to company member
		if (!companyMemberRepository.existsByRecruiterEmailAndCompanyId(ownerEmail, companySaveDocument.getId())) {
			CompanyMemberRole companyMemberRole = "ROLE_ADMIN".equals(role) ? CompanyMemberRole.ADMIN
					: CompanyMemberRole.OWNER;
			CompanyMemberDTO memberDTO = CompanyMemberDTO.builder().recruiterEmail(ownerEmail)
					.companyId(companySaveDocument.getId()).companyLogo(companySaveDocument.getLogoUrl())
					.companyName(companySaveDocument.getCompanyName()).role(companyMemberRole)
					.status(CompanyMemberStatus.ACTIVE).build();

			companyMemberRepository.save(memberMapper.toDocument(memberDTO));
		}

		removeConfirmedUrlsFromTemp(companyProfileDTO);

		fileStorageService.deleteFilesAsync(oldUrlsToDelete);

		return mapper.toDTO(companySaveDocument);
	}

	private boolean hasChanged(String oldUrl, String newUrl) {
		if (oldUrl == null && newUrl != null)
			return true;
		if (oldUrl != null && !oldUrl.equals(newUrl))
			return true;
		return false;
	}

	private void removeConfirmedUrlsFromTemp(CompanyProfileDTO dto) {
		List<String> confirmedUrls = new ArrayList<>();
		if (dto.getLogoUrl() != null)
			confirmedUrls.add(dto.getLogoUrl());
		if (dto.getCoverImageUrl() != null)
			confirmedUrls.add(dto.getCoverImageUrl());
		if (dto.getBusinessLicenseUrl() != null)
			confirmedUrls.add(dto.getBusinessLicenseUrl());
		if (dto.getGalleryImages() != null)
			confirmedUrls.addAll(dto.getGalleryImages());

		if (!confirmedUrls.isEmpty()) {
			tempMediaRepository.deleteByFileUrlIn(confirmedUrls);
		}
	}

	@Override
	public CompanyProfileDTO findById(String id) {
		return mapper.toDTO(companyProfileRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Company not found")));
	}

	@Override
	public Slice<CompanyProfileDTO> findAllCompanies(Pageable pageable) {

		Slice<CompanyDocument> companiesDocument = companyProfileRepository.findAll(pageable);

		return companiesDocument.map(mapper::toDTO);
	}

	@Override
	public List<CompaniesInfoResponse> findMyCompanies(String email) {
		List<CompanyMemberDocument> memberDocuments = companyMemberRepository.findByRecruiterEmail(email);

		return memberDocuments.stream()
				.map(member -> CompaniesInfoResponse.builder().id(member.getCompanyId()).name(member.getCompanyName())
						.role(member.getRole().name()).logo(member.getCompanyLogo()).build())
				.collect(Collectors.toList());
	}

	@Override
	public Slice<CompanyProfileDTO> findMyCompanies(String ownerEmail, Pageable pageable) {

		Slice<CompanyDocument> companiesDocument = companyProfileRepository.findByOwnerEmail(ownerEmail, pageable);

		return companiesDocument.map(mapper::toDTO);
	}

	private boolean isAuthorization(String role) {
		boolean isAdmin = "ROLE_ADMIN".equals(role);

		boolean isRecruiter = "ROLE_RECRUITER".equals(role);

		return (isAdmin || isRecruiter);
	}

	@Override
	public ResponseUpload uploadMedia(MultipartFile file, String type, String companyId)
			throws IOException, IllegalArgumentException {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File upload is required");
		}

		String contentType = file.getContentType();
		if ("businessLicense".equalsIgnoreCase(type)) {
			if (!isPdf(contentType) && !isImage(contentType)) {
				throw new IllegalArgumentException("Business License must be a valid PDF or Image file");
			}
		} else {
			if (!isImage(contentType)) {
				throw new IllegalArgumentException("Invalid image file (PNG, JPG, WEBP).");
			}
		}

		String newCompanyId = new ObjectId().toHexString();

		companyId = (companyId.equals("temp")) ? newCompanyId : companyId;

		String urlString = fileStorageService.uploadCompanyFile(file, type, companyId);

		return ResponseUpload.builder().url(urlString).newCompanyId(newCompanyId).build();
	}

	private boolean isImage(String contentType) {
		return contentType != null && contentType.startsWith("image/");
	}

	private boolean isPdf(String contentType) {
		return "application/pdf".equalsIgnoreCase(contentType);
	}

}
