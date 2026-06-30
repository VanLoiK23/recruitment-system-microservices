package com.loihvk23.job_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobSearchRequest {
    private String technology;
    private Double minSalary;
    private Double maxSalary;
    private String jobLevel;
    private String location;
}
