package com.loihvk23.profile_service.dto.embedded;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project {
	private String project;
    private LocalDate date;
    private String desc;
}