package com.loihvk23.profile_service.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("recruiter_profiles")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterProfileDocument {
	
	@Id
	private String id;
	
	@Indexed(unique = true)
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