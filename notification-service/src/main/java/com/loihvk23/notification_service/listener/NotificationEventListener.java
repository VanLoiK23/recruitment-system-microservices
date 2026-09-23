package com.loihvk23.notification_service.listener;

import java.io.IOException;
import java.util.Map;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.notification_service.config.RabbitMQConfig;
import com.loihvk23.notification_service.dto.request.NotificationEvent;
import com.loihvk23.notification_service.dto.request.NotificationRejectEvent;
import com.loihvk23.notification_service.dto.request.NotificationRequest;
import com.loihvk23.notification_service.service.NotificationService;
import com.rabbitmq.client.Channel;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

	private final NotificationService notificationService;

	private final ObjectMapper objectMapper;

	@RabbitListener(queues = RabbitMQConfig.NOTIFICATION_EMAIL_QUEUE)
	public void consumApplicationBulkEvent(Map<String, Object> payload,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey, Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {

		if (RabbitMQConfig.ROUTING_KEY_CONFIRM_EMAIL.equals(routingKey)) {
			NotificationEvent notificationEvent = objectMapper.convertValue(payload, NotificationEvent.class);
			notificationService.sendOTPEmail(notificationEvent);
		} else if (RabbitMQConfig.ROUTING_KEY_RESET_PASSWORD.equals(routingKey)) {
			NotificationEvent notificationEvent = objectMapper.convertValue(payload, NotificationEvent.class);
			notificationService.sendResetEmail(notificationEvent);
		} else if (RabbitMQConfig.ROUTING_KEY_SENT_TO_CANDIDATE.equals(routingKey)) {
			NotificationRequest request = objectMapper.convertValue(payload, NotificationRequest.class);
			notificationService.sendEmailToCandidates(request.getAuthorEmail(), request);
		} else if (RabbitMQConfig.ROUTING_KEY_REJECT_TO_CANDIDATE.equals(routingKey)) {
			NotificationRejectEvent request = objectMapper.convertValue(payload, NotificationRejectEvent.class);
			notificationService.sendEmailRejectToCandidates(request.getAuthorEmail(), request);
		}
	}
}
