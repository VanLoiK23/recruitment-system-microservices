package com.loihvk23.notification_service.service;

import com.loihvk23.notification_service.dto.request.NotificationEvent;
import com.loihvk23.notification_service.dto.request.NotificationRejectEvent;
import com.loihvk23.notification_service.dto.request.NotificationRequest;

public interface NotificationService {
	boolean sendOTPEmail(NotificationEvent event);

	boolean sendResetEmail(NotificationEvent event);

	void processBulkEmailRequest(NotificationRequest request, String authorEmail);

	void sendEmailToCandidates(String authorEmail, NotificationRequest notificationRequest);

	void sendEmailRejectToCandidates(String authorEmail, NotificationRejectEvent request);
}
