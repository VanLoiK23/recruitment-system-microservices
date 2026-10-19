package com.loihvk23.profile_service.service.impl;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.profile_service.CompanyMemberStatus;
import com.loihvk23.profile_service.document.CompanyDocument;
import com.loihvk23.profile_service.document.CompanyMemberDocument;
import com.loihvk23.profile_service.dto.CompanyMemberDTO;
import com.loihvk23.profile_service.mapper.CompanyMemberMapper;
import com.loihvk23.profile_service.repository.CompanyMemberRepository;
import com.loihvk23.profile_service.repository.CompanyProfileRepository;
import com.loihvk23.profile_service.service.CompanyMemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyMemberServiceImpl implements CompanyMemberService {
	private final CompanyMemberRepository companyMemberRepository;

	private final CompanyProfileRepository companyProfileRepository;

	private final CompanyMemberMapper mapper;

	private static final Map<CompanyMemberStatus, Set<CompanyMemberStatus>> VALID_TRANSITIONS = Map.of(
			CompanyMemberStatus.PENDING, Set.of(CompanyMemberStatus.ACTIVE, CompanyMemberStatus.REJECTED),
			CompanyMemberStatus.ACTIVE, Set.of(CompanyMemberStatus.SUSPENDED, CompanyMemberStatus.REMOVED),
			CompanyMemberStatus.SUSPENDED, Set.of(CompanyMemberStatus.ACTIVE, CompanyMemberStatus.REMOVED));

	@Override
	public CompanyMemberDTO joinCompany(CompanyMemberDTO companyMemberDTO, String recruiterEmail) {

		if (companyMemberRepository.existsByRecruiterEmailAndCompanyId(recruiterEmail,
				companyMemberDTO.getCompanyId())) {
			throw new IllegalArgumentException("You 've already applied join this company");
		}
		CompanyMemberDTO companyMemberAdjustDto = CompanyMemberDTO.builder().recruiterEmail(recruiterEmail)
				.companyId(companyMemberDTO.getCompanyId()).companyLogo(companyMemberDTO.getCompanyLogo())
				.companyName(companyMemberDTO.getCompanyName()).build();

		return mapper.toDTO(companyMemberRepository.save(mapper.toDocument(companyMemberAdjustDto)));
	}

	@Override
	public CompanyMemberDTO findById(String id) {
		return mapper.toDTO(companyMemberRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Company's Member not found")));
	}

	@Override
	public Slice<CompanyMemberDTO> findMemberOfCompany(String companyId, String email, String role, Pageable pageable,
			String memberStatus) {
		if (!isAuthorization(email, role, companyId)) {
			throw new IllegalArgumentException("You are not authorized to access this resources");
		}
		CompanyMemberStatus companyMemberStatus = CompanyMemberStatus.ACTIVE;

		if (isValidStaus(memberStatus)) {
			companyMemberStatus = CompanyMemberStatus.valueOf(memberStatus);
		}

		Slice<CompanyMemberDocument> companiesSlice = companyMemberRepository.findByCompanyIdAndStatus(companyId,
				companyMemberStatus, pageable);

		return companiesSlice.map(mapper::toDTO);
	}

	@Override
	public CompanyMemberDTO updateStaus(String id, String newStatus, String ownerEmail, String role) {
		CompanyMemberDocument member = companyMemberRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Company's Member not found"));

		if (!isAuthorization(ownerEmail, role, member.getCompanyId())) {
			throw new IllegalArgumentException("You are not authorized to update this member's status");
		}
		CompanyMemberStatus targetStatus;
		try {
			targetStatus = CompanyMemberStatus.valueOf(newStatus.toUpperCase().trim());
		} catch (IllegalArgumentException | NullPointerException e) {
			throw new IllegalArgumentException("Invalid status value: " + newStatus);
		}

		CompanyMemberStatus currentStatus = member.getStatus();

		if (currentStatus == targetStatus) {
			return mapper.toDTO(member);
		}

		Set<CompanyMemberStatus> allowedNextStatuses = VALID_TRANSITIONS.getOrDefault(currentStatus, Set.of());
		if (!allowedNextStatuses.contains(targetStatus)) {
			throw new IllegalStateException(
					String.format("Cannot transition status from %s to %s", currentStatus, targetStatus));
		}

		member.setStatus(targetStatus);
		if (targetStatus == CompanyMemberStatus.ACTIVE && member.getJoinedAt() == null) {
			member.setJoinedAt(LocalDateTime.now());
		}

		return mapper.toDTO(companyMemberRepository.save(member));
	}

	private boolean isAuthorization(String email, String role, String companyId) {
		boolean isAdmin = "ROLE_ADMIN".equals(role);

		CompanyDocument companyDocument = companyProfileRepository.findById(companyId)
				.orElseThrow(() -> new IllegalArgumentException("Company not found"));

		boolean isOwner = companyDocument.getOwnerEmail().equals(email);

		return (isAdmin || isOwner);
	}

	private boolean isValidStaus(String status) {
		try {
			CompanyMemberStatus.valueOf(status.toUpperCase().trim());
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
