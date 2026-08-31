package com.loihvk23.job_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatsJobRespone {

	private Long totalJobs;

	private Long totalCandidates;

	private Long hired;
}
