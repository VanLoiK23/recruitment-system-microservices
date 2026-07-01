package com.loihvk23.application_service.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "job_cache")
@Data
public class JobCacheEntity {

	@Id
	private String id;
	private String recruiterEmail;
	private String status;
}
