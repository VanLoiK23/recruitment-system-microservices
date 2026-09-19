package com.loihvk23.auth_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationEvent {
	private String email;

	private String otpOrResetToken;
}
