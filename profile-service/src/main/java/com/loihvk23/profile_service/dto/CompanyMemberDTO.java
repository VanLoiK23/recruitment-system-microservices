package com.loihvk23.profile_service.dto;

import java.time.LocalDateTime;

import com.loihvk23.profile_service.CompanyMemberRole;
import com.loihvk23.profile_service.CompanyMemberStatus;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyMemberDTO {
	private String id;

	@NotBlank(message = "Company's Id is required")
	private String companyId;
	private String companyName;
	private String companyLogo;

	private String recruiterEmail;

	@Builder.Default
	private CompanyMemberRole role = CompanyMemberRole.RECRUITER;
	@Builder.Default
	private CompanyMemberStatus status = CompanyMemberStatus.PENDING;

	@Builder.Default
	private LocalDateTime requestedAt = LocalDateTime.now();

	private LocalDateTime joinedAt;
}