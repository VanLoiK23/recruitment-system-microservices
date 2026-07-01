package com.loihvk23.application_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "applications")
@Data
public class ApplicationEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String jobId;

	@Column(nullable = false)
	private String candidateEmail;

	@Column(nullable = false)
	private String cvUrl;
	
	@Column(nullable = false)
	private String status;

	@Column(nullable = true)
	private LocalDateTime createdAt;

}
