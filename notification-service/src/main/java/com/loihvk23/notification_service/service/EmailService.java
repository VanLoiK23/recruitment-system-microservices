package com.loihvk23.notification_service.service;

import java.util.List;

import com.loihvk23.notification_service.dto.NotificationEvent;

public interface EmailService {
	boolean sendOTPEmail(NotificationEvent event);

	boolean sendResetEmail(NotificationEvent event);

	void sendEmailToCandidate(String authorEmail, String templateKey, List<String> toEmails);
}
