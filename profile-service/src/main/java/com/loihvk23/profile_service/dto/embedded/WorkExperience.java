package com.loihvk23.profile_service.dto.embedded;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkExperience {
	private String company;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private List<String> skills; 
    private String desc;
}