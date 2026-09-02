package com.loihvk23.application_service.entity;

import java.time.LocalDateTime;

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
	
	@Column(columnDefinition = "jsonb", nullable = true)
	private String cvSnapshotJson; // save ATS profile as json format

	@Column(nullable = false)
	private String status;

	@Column(nullable = false)
	private String description;

	@Column(nullable = true)
	private LocalDateTime createdAt;

	@Builder.Default
	@Column(nullable = true, name = "score_by_AI")
	private Integer scoreByAI = 0;
	
	@Column(columnDefinition = "jsonb")
	private String aiAnalysisResult;
}
