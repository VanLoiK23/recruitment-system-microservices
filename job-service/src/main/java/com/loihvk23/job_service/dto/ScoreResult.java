package com.loihvk23.job_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

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

	@JsonProperty("final_score")
    private Double finalScore;
    
    @JsonProperty("sbert_score")
    private Double sbertScore;
    
    @JsonProperty("skill_score")
    private Double skillScore;
    
    @JsonProperty("verdict")
    private String verdict;
    
    @JsonProperty("seniority_mismatch_warning")
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
