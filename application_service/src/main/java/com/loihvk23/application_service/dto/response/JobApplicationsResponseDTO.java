package com.loihvk23.application_service.dto.response;

import org.springframework.data.domain.Slice;

import com.loihvk23.application_service.dto.ApplicationDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationsResponseDTO {
    private long totalCandidates;
    private long numberHighScore;
    private long numberNotScan;
    
    private Slice<ApplicationDTO> applications;
}