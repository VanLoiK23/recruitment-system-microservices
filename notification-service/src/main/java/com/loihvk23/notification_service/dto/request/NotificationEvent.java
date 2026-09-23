package com.loihvk23.notification_service.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationEvent {
	private String email;

	private String otpOrResetToken;
}
