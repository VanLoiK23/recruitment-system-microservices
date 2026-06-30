package com.loihvk23.job_service.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO {
	private String id;
	
	@NotNull(message = "Minimum salary is required")
	@Min(value = 0, message = "Salary must be greater than or equal to 0")
	private Double minSalary;
	
	@NotNull(message = "Range Salary must be not null")
	@Min(value = 0, message = "Salary must be greater than or equal to 0")
	private Double maxSalary;
	
	@NotBlank(message = "Title must be not empty")
	private String title;
	
	@NotBlank(message = "Description must be not empty")
	private String description;
	
	private String status;
	
	private String recruiterEmail;
	
	@NotEmpty(message = "List technologies must be not empty")
	private List<String> technologies;
	
	@NotEmpty(message = "List requirements must be not empty")
    private List<String> requirements;
    
	@NotBlank(message = "Level job must be not empty")
    private String jobLevel; 

	@NotBlank(message = "Location must be not empty")
    private String location; 

    private LocalDateTime createdAt;
}
