package com.loihvk23.profile_service.document;

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

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Project {
	private String project;
    private LocalDate date;
    private String desc;
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Education {
	private String school;
    private String major;
    private LocalDate startDate;
    private LocalDate endDate;
    private String desc;
}
