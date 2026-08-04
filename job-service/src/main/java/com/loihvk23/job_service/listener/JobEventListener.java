package com.loihvk23.job_service.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.dto.UserAppliedJobDTO;
import com.loihvk23.job_service.service.JobService;
import com.loihvk23.job_service.service.UserAppliedJobService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JobEventListener {

	private final JobService jobService;
	private final UserAppliedJobService userAppliedJobService;

	// if queue has item them this is active
	@RabbitListener(queues = RabbitMQConfig.JOB_QUEUE)
	public void consumJobEvent(UserAppliedJobDTO userAppliedEvent,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey) {
		System.out.println("Receive a message from Application Service: " + userAppliedEvent);

		String jobId = userAppliedEvent.getJobId();

		if (RabbitMQConfig.KEY_JOB_APPLIED_SAVE.equals(routingKey)) {
			jobService.incrementApplicantCount(jobId);
			userAppliedJobService.saveAppliedJob(userAppliedEvent);
		} else if (RabbitMQConfig.KEY_JOB_APPLIED_UPDATE.equals(routingKey)) {
			userAppliedJobService.saveAppliedJob(userAppliedEvent);
		} else if (RabbitMQConfig.KEY_JOB_APPLIED_DELETE.equals(routingKey)) {
			userAppliedJobService.deleteAppliedJob(userAppliedEvent.getJobId(), userAppliedEvent.getCandidateEmail());
		}
	}
}
