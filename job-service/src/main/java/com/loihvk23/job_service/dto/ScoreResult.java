package com.loihvk23.job_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResult {
	private Long applicationId;
	private Boolean tier2Eligible;

	private Double finalScore;
	private Double sbertScore;
	private Double skillScore;
	private String verdict;
	private Boolean seniorityMismatchWarning;
	private String jobTextSnapshot;

	public ScoreResult(ScoreResult scoreResult, String jobText) {
		this.applicationId = scoreResult.getApplicationId();
		this.tier2Eligible = scoreResult.getTier2Eligible();
		this.finalScore = scoreResult.getFinalScore();
		this.sbertScore = scoreResult.getSbertScore();
		this.skillScore = scoreResult.getSkillScore();
		this.seniorityMismatchWarning = scoreResult.getSeniorityMismatchWarning();
		this.jobTextSnapshot = jobText;
	}
}
