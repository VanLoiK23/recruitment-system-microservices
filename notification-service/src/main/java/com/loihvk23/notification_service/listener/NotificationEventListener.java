package com.loihvk23.notification_service.listener;

import java.io.IOException;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.notification_service.config.RabbitMQConfig;
import com.loihvk23.notification_service.dto.NotificationEvent;
import com.loihvk23.notification_service.service.EmailService;
import com.rabbitmq.client.Channel;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

	private final EmailService emailService;

	@RabbitListener(queues = RabbitMQConfig.NOTIFICATION_EMAIL_QUEUE)
	public void consumApplicationBulkEvent(NotificationEvent notificationEvent,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey, Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {

		if (RabbitMQConfig.ROUTING_KEY_CONFIRM_EMAIL.equals(routingKey)) {
			emailService.sendOTPEmail(notificationEvent);
		} else if (RabbitMQConfig.ROUTING_KEY_RESET_PASSWORD.equals(routingKey)) {
			emailService.sendResetEmail(notificationEvent);
		}
	}
}
