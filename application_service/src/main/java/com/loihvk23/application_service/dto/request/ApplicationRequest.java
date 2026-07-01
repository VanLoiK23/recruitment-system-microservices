package com.loihvk23.application_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationRequest {
	@NotBlank(message = "Job id is required")
	private String jobId;

//	@NotBlank(message = "Your CV is required")
//	@URL(message = "CV must be a valid URL link")
//	@Pattern(regexp = "^.*\\.(pdf|doc|docx)(\\?.*)?$", message = "Only PDF, DOC, or DOCX file formats are allowed!")
	private String cvUrl;

	@NotBlank(message = "Info does not fill up")
	@Email(message = "Some field of request doesn't correct")
	private String recruiterEmail;
}
