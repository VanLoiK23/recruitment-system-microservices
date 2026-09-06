package com.loihvk23.application_service.dto.request;

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
	private String verdict;
	private Boolean seniorityMismatchWarning;
	private String jobTextSnapshot;
}
