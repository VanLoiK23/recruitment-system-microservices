package com.loihvk23.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	public static final String NOTIFICATION_EXCHANGE = "notification.exchange";

	public static final String NOTIFICATION_EMAIL_QUEUE = "notification.email.queue";

	public static final String KEY_NOTIFICATION_EMAIL_PATTERN = "notification.email.#";

	public static final String ROUTING_KEY_RESET_PASSWORD = "notification.email.reset_password";
	public static final String ROUTING_KEY_CONFIRM_EMAIL = "notification.email.sent_otp";
	public static final String ROUTING_KEY_SENT_TO_CANDIDATE = "notification.email.sent_to_candidate";
	public static final String ROUTING_KEY_REJECT_TO_CANDIDATE = "notification.email.reject_to_candidate";

	@Bean
	public TopicExchange notificationExchange() {
		return new TopicExchange(NOTIFICATION_EXCHANGE);
	}

	@Bean
	public Queue notificationEmailQueue() {
		return new Queue(NOTIFICATION_EMAIL_QUEUE, true);
	}

	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public Binding bindNotificationEmail(Queue notificationEmailQueue, TopicExchange notificationExchange) {
		return BindingBuilder.bind(notificationEmailQueue).to(notificationExchange)
				.with(KEY_NOTIFICATION_EMAIL_PATTERN);
	}
}