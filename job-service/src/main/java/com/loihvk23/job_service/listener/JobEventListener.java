package com.loihvk23.job_service.listener;

import java.io.IOException;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.dto.ScoreResult;
import com.loihvk23.job_service.dto.UserAppliedJobDTO;
import com.loihvk23.job_service.service.JobService;
import com.loihvk23.job_service.service.UserAppliedJobService;
import com.loihvk23.job_service.service.client.CvJdScoreClientTier1;
import com.rabbitmq.client.Channel;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JobEventListener {

	private final JobService jobService;
	private final UserAppliedJobService userAppliedJobService;

	private final CvJdScoreClientTier1 scoreClient;
	private final RabbitTemplate rabbitTemplate;

	// if queue has item them this is active
	@RabbitListener(queues = RabbitMQConfig.JOB_QUEUE, containerFactory = "manualAckContainerFactory")
	public void consumJobEvent(UserAppliedJobDTO userAppliedEvent,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey, Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
		System.out.println("Receive a message from Application Service: " + userAppliedEvent);

		String jobId = userAppliedEvent.getJobId();

		if (RabbitMQConfig.KEY_JOB_APPLIED_SAVE.equals(routingKey)) {
			jobService.incrementApplicantCount(jobId);
			userAppliedJobService.saveAppliedJob(userAppliedEvent);

			scoreClient.scoreSingle(userAppliedEvent.getCvTextForScoring(), userAppliedEvent.getJobId()).subscribe(
					tier1 -> onSuccess(tier1, userAppliedEvent.getAppID(), channel, deliveryTag),
					error -> onError(error, userAppliedEvent.getAppID(), channel, deliveryTag));
		} else if (RabbitMQConfig.KEY_JOB_APPLIED_UPDATE.equals(routingKey)) {
			userAppliedJobService.saveAppliedJob(userAppliedEvent);
		} else if (RabbitMQConfig.KEY_JOB_APPLIED_DELETE.equals(routingKey)) {
			userAppliedJobService.deleteAppliedJob(userAppliedEvent.getJobId(), userAppliedEvent.getCandidateEmail());
		}
	}

	private void onSuccess(ScoreResult tier1, Long applicationId, Channel channel, long deliveryTag) {
		try {
			ScoreResult scoreRespone = ScoreResult.builder().applicationId(applicationId)
					.finalScore(tier1.getFinalScore()).verdict(tier1.getVerdict())
					.tier2Eligible(tier1.getFinalScore() >= 0.45)
					.seniorityMismatchWarning(tier1.getSeniorityMismatchWarning())
					.jobTextSnapshot(tier1.getJobTextSnapshot()).build();

			rabbitTemplate.convertAndSend(RabbitMQConfig.SCORING_APPLICATION, scoreRespone);

			channel.basicAck(deliveryTag, false);
		} catch (IOException e) {
//			log.error("Failed to ack message for application {}", applicationId, e);
			e.printStackTrace();
		}
	}

	private void onError(Throwable error, Long applicationId, Channel channel, long deliveryTag) {
//		log.error("Scoring failed for application {}", applicationId, error);
		try {
			// requeue=true -- day message tro lai queue, RabbitMQ se giao lai (co the sang
			// consumer khac)
			// Neu loi lap lai nhieu lan (VD: job khong ton tai vinh vien), nen cau hinh
			// dead-letter-exchange thay vi requeue mai mai, tranh vong lap vo han.
			channel.basicNack(deliveryTag, false, true);
		} catch (IOException e) {
//			log.error("Failed to nack message for application {}", applicationId, e);
		}
	}
}
