package com.loihvk23.application_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.application_service.config.RabbitMQConfig;
import com.loihvk23.application_service.dto.JobCacheDTO;
import com.loihvk23.application_service.dto.request.JobEvent;
import com.loihvk23.application_service.service.JobCacheService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JobEventListener {

	private final JobCacheService jobCacheService;

	// if queue has item them this is active
	@RabbitListener(queues = RabbitMQConfig.JOB_QUEUE)
	public void consumJobEvent(JobEvent jobEvent, @Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
		System.out.println("Receive a message from Job Service: " + jobEvent.getId());

		JobCacheDTO jobCacheDTO = JobCacheDTO.builder().id(jobEvent.getId())
				.recruiterEmail(jobEvent.getRecruiterEmail()).status(jobEvent.getStatus()).build();

		if (RabbitMQConfig.JOB_UPSERTED_KEY.equals(routingKey)) {

			jobCacheService.upsertJob(jobCacheDTO);
		} else if (RabbitMQConfig.JOB_DELETE_KEY.equals(routingKey)) {
			jobCacheService.deleteJob(jobCacheDTO.getId());
		}
	}
}
