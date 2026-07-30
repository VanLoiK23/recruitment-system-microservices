package com.loihvk23.profile_service.document.embedded;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Education {
	private String school;
    private String major;
    private LocalDate startDate;
    private LocalDate endDate;
    private String desc;
}

