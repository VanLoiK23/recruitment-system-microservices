package com.loihvk23.profile_service.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterProfileDTO {

	private String id;

	private String emailRecruiter;

	private String fullName;

	private String jobPosition;

	private String companyName;

	private String companyWebsite;

	private String phone;

	private String cityProvince;

	private String address;

	private String linkedin;

	private Integer yearsOfExperience;

	private String summary;

	@Builder.Default
	private List<String> hiringSpecialties = new ArrayList<>();
}