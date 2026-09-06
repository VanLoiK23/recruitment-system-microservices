package com.loihvk23.application_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tier2Result {
	private Double overallMatchScore;

	private List<String> matchedSkills;

	private List<String> missingSkills;

	private String experienceAlignment;

	private String summaryComment;

}