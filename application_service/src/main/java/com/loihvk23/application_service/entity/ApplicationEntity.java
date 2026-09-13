package com.loihvk23.application_service.entity;

import java.time.LocalDateTime;

import com.loihvk23.application_service.ApplicationStatus;
import com.loihvk23.application_service.CVSource;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String jobId;

	@Column(nullable = false)
	private String fullName;

	@Column(nullable = false)
	private String candidateEmail;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = true)
	private String cvUrl;

	@Column(columnDefinition = "text", nullable = true)
	private String cvTextExtracted;

	@Builder.Default
	@Column(nullable = false)
	private CVSource cvSourceType = CVSource.URL;

	@Column(columnDefinition = "json", nullable = true)
	private String cvSnapshotJson; // save ATS profile as json format

	@Builder.Default
	@Column(nullable = false)
	private ApplicationStatus status = ApplicationStatus.PENDING;

	@Column(nullable = false)
	private String description;

	@Column(nullable = true)
	private LocalDateTime createdAt;

	//score for tier1
	@Column(nullable = true, name = "score_by_AI")
	private Double scoreByAI;

	@Column(nullable = true)
	private String verdict;

	@Column(nullable = true)
	private Boolean seniorityMismatchWarning;
	
	@Column(columnDefinition = "text", nullable = true)
	private String jobTextSnapshot; // serve for tier 2 send cv/jd to LLM for detail explain

	@Column(columnDefinition = "json")
	private String aiAnalysisResult;
}
