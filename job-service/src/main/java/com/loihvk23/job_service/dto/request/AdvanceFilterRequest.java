package com.loihvk23.job_service.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AdvanceFilterRequest {
	private List<String> categories;

	private String search;

	private List<String> locations;

	private String experience;

	private String workType;

	private boolean hotJob;
	
	private Double minSalary;
	
	private Double maxSalary;
}
