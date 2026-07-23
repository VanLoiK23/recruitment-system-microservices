package com.loihvk23.job_service.document;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("jobs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDocument {
	@Id
	private String id;
	
	private Double minSalary;
	
	private Double maxSalary;
	
	private String title;

	private String description;
	
	private String status;
	
	private String recruiterEmail;
	
	private List<String> categories; 
	
	private List<String> roles;
	
	private List<String> technologies;
	
    private List<String> requirements;
    
    private List<String> benefits;
    
    @Indexed
    private String jobLevel; 
    
    private String workType; 
    
    @Indexed
    private boolean hotJob; 

    private String location; 

    @CreatedDate
    private LocalDateTime createdAt;

}
