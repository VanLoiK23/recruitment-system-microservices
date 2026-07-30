package com.loihvk23.profile_service.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.loihvk23.profile_service.document.embedded.Education;
import com.loihvk23.profile_service.document.embedded.Project;
import com.loihvk23.profile_service.document.embedded.WorkExperience;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("candidate_profiles")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDocument {
	
	@Id
	private String id;
	@Indexed(unique = true)
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
	private List<String> skills = new ArrayList();
	
	@Builder.Default
	private List<String> softSkills = new ArrayList();
	
	@Builder.Default
    private List<String> languages = new ArrayList<>();
	
	@Builder.Default
    private List<WorkExperience> workExperiences = new ArrayList<>();

    @Builder.Default
    private List<Education> educations = new ArrayList<>();
    
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

}

