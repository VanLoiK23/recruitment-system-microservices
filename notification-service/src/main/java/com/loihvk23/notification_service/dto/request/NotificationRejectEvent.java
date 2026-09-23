package com.loihvk23.notification_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationRejectEvent {

	private String authorEmail;

	private String jobTitle;

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
