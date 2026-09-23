package com.loihvk23.application_service.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRejectEvent {

	private String authorEmail;

	private String jobTitle;

	private List<ReceiverInfo> receivers;

	@Builder
	public static class ReceiverInfo {
		@NotBlank(message = "Receiver name is required")
		private String name;

		@NotBlank(message = "Receiver email is required")
		@Email(message = "Invalid receiver email format")
		private String email;
	}
}
