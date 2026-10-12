package com.loihvk23.profile_service.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.validator.constraints.URL;

import com.loihvk23.profile_service.VerificationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileDTO {

	private String id;

	private String ownerEmail;

	@NotBlank(message = "Company name cannot be blank")
	@Size(min = 2, max = 150, message = "Company name must be between 2 and 150 characters")
	private String companyName;

	private VerificationStatus verificationStatus;

	@URL(message = "Business license must be a valid URL")
	private String businessLicenseUrl;

	@URL(message = "Website must be a valid URL")
	private String website;

	@URL(message = "Logo URL must be a valid URL")
	private String logoUrl;

	@URL(message = "Cover image must be a valid URL")
	private String coverImageUrl;

	@NotBlank(message = "Industry cannot be blank")
	@Size(max = 100, message = "Industry cannot exceed 100 characters")
	private String industry;

	@NotBlank(message = "Company size is required")
	private String companySize;

	@NotBlank(message = "Tax ID is required")
	@Pattern(regexp = "^[0-9]{10}(-[0-9]{3})?$", message = "Tax ID must be 10 digits or 13 digits with hyphen (e.g., 0123456789 or 0123456789-001)")
	private String taxId;

	@Size(max = 3000, message = "About Us section cannot exceed 3000 characters")
	private String aboutUs;

	@NotNull(message = "Headquarters location is required")
	@Valid
	private CompanyLocation headquarters;

	@Valid
	@Builder.Default
	private List<CompanyLocation> branches = new ArrayList<>();

	@Builder.Default
	private List<@NotBlank(message = "Benefit cannot be blank") @Size(max = 100, message = "Benefit length cannot exceed 100 characters") String> benefits = new ArrayList<>();

	@Builder.Default
	private List<@URL(message = "Gallery item must be a valid URL") String> galleryImages = new ArrayList<>();

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private Boolean isNewCompany;
}