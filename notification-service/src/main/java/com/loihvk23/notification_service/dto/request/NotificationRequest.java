package com.loihvk23.notification_service.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class NotificationRequest {

	private String authorEmail;
	
	@NotBlank(message = "Job title is required")
	private String jobTitle;

//	@NotBlank(message = "Interview date is required")
//	@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}.*", message = "Invalid interview date format. Expected format: YYYY-MM-DD")
	private String interviewDate;

	@NotBlank(message = "Template key is required")
	private String templateKey;

	@NotEmpty(message = "Receivers list cannot be empty")
	@Valid 
	private List<ReceiverInfo> receivers;

	@Data
	public static class ReceiverInfo {
		@NotBlank(message = "Receiver name is required")
		private String name;

		@NotBlank(message = "Receiver email is required")
		@Email(message = "Invalid receiver email format")
		private String email;
	}
}
