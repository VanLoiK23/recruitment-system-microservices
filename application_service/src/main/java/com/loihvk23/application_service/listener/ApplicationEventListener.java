package com.loihvk23.application_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.application_service.config.RabbitMQConfig;
import com.loihvk23.application_service.dto.request.ScoreResult;
import com.loihvk23.application_service.service.ApplicationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApplicationEventListener {

	private final ApplicationService applicationService;

	// if queue has item them this is active
	@RabbitListener(queues = RabbitMQConfig.APPLICATION_QUEUE)
	public void handleApplicationEvent(ScoreResult scoreResult,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {

		if (RabbitMQConfig.SCORING_APPLICATION.equals(routingKey)) {
			applicationService.updateScoreTier1Application(scoreResult.getApplicationId(), scoreResult);
		}
	}
}
