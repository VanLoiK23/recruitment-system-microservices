package com.loihvk23.application_service.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.loihvk23.application_service.dto.request.profileEmbedded.Education;
import com.loihvk23.application_service.dto.request.profileEmbedded.Language;
import com.loihvk23.application_service.dto.request.profileEmbedded.Project;
import com.loihvk23.application_service.dto.request.profileEmbedded.WorkExperience;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateProfileRequest {

	private String id;
	private String emailCandidate;

	private String fullName;

	private String jobPosition;

	private String phone;

	private String cityProvince;

	private String address;

	private String github;

	private String linkedin;

	private Integer yearsOfExperience;

	private String summary;

	@Builder.Default
	private Boolean openToWork = false;

	@Builder.Default
	private Integer totalPercent = 10;

	@Builder.Default
	private List<String> skills = new ArrayList();

	@Builder.Default
	private List<String> softSkills = new ArrayList();

	@Builder.Default
	private List<Language> languages = new ArrayList<>();

	@Builder.Default
	private List<WorkExperience> workExperiences = new ArrayList<>();

	@Builder.Default
	private List<Education> educations = new ArrayList<>();

	@Builder.Default
	private List<Project> projects = new ArrayList<>();
}
