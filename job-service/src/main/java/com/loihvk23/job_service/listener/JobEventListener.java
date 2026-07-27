package com.loihvk23.job_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.dto.request.JobEvent;
import com.loihvk23.job_service.service.JobService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JobEventListener {

	private final JobService jobService;

	// if queue has item them this is active
	@RabbitListener(queues = RabbitMQConfig.JOB_QUEUE)
	public void consumJobEvent(JobEvent jobEvent, @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
		System.out.println("Receive a message from Job Service: " + jobEvent.getId());

		String jobId = jobEvent.getId();

		if (RabbitMQConfig.KEY_JOB_APPLIED.equals(routingKey)) {
			jobService.incrementApplicantCount(jobId);
		}
	}
}
