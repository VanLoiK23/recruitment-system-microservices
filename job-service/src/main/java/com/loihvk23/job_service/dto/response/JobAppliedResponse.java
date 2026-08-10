package com.loihvk23.job_service.dto.response;

import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.JobDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobAppliedResponse {
	private Slice<JobDTO> jobSlice;
	private int totalElement;
}
