package com.loihvk23.job_service.document;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.loihvk23.job_service.JobStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("jobs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@CompoundIndex(name = "tech_status_deadline_idx", def = "{'technologies': 1, 'status': 1, 'deadline': 1}")
public class JobDocument {
	@Id
	private String id;

	private Double minSalary;

	private Double maxSalary;

	private String title;

	private String description;

	@Builder.Default
	private JobStatus status = JobStatus.DRAFT;
	
	private String reason;

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

	private Long applicantCount;

	@CreatedDate
	private LocalDateTime createdAt;

	private LocalDateTime deadline;

}
