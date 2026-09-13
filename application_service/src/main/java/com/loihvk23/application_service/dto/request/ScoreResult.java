package com.loihvk23.application_service.dto.request;

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
    
    @JsonProperty("verdict")
    private String verdict;
    
    @JsonProperty("seniority_mismatch_warning")
    private Boolean seniorityMismatchWarning;
    
	private String jobTextSnapshot;
}
