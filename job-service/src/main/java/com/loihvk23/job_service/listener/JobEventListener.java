package com.loihvk23.job_service.listener;

import java.io.IOException;
import java.util.List;

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
	@RabbitListener(queues = RabbitMQConfig.APPLICATION_QUEUE, containerFactory = "manualAckContainerFactory")
	public void consumApplicationEvent(UserAppliedJobDTO userAppliedEvent,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey, Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {
		System.out.println("Receive a message from Application Service: " + userAppliedEvent);

		if (RabbitMQConfig.APPLICATION_EVENT_SAVE.equals(routingKey)) {
			String jobId = userAppliedEvent.getJobId();

			if (userAppliedJobService.saveAppliedJob(userAppliedEvent) != null) {
				jobService.incrementApplicantCount(jobId);
			}

//			scoreClient.scoreSingle(userAppliedEvent.getCvTextForScoring(), userAppliedEvent.getJobId())
//					.subscribe(tier1 -> {
//						System.out.println("Score CV compelete: " + userAppliedEvent.getAppID() + " - Score: "
//								+ tier1.getFinalScore());
//						onSuccess(tier1, userAppliedEvent.getAppID(), channel, deliveryTag);
//					}, error -> {
//						System.err.println("Error " + userAppliedEvent.getAppID() + ": " + error.getMessage());
//						onError(error, userAppliedEvent.getAppID(), channel, deliveryTag);
//					});
//			
			try {
				ScoreResult tier1 = scoreClient
						.scoreSingle(userAppliedEvent.getCvTextForScoring(), userAppliedEvent.getJobId()).block();

				onSuccess(tier1, userAppliedEvent.getAppID(), channel, deliveryTag);
			} catch (Exception e) {
				onError(e, userAppliedEvent.getAppID(), channel, deliveryTag);
			}
		} else if (RabbitMQConfig.APPLICATION_EVENT_UPDATE.equals(routingKey)) {
			try {
				userAppliedJobService.saveAppliedJob(userAppliedEvent);
				channel.basicAck(deliveryTag, false);
			} catch (Exception e) {
				channel.basicNack(deliveryTag, false, false);
			}
		} else if (RabbitMQConfig.APPLICATION_EVENT_DELETE.equals(routingKey)) {
			try {
				userAppliedJobService.deleteAppliedJob(userAppliedEvent.getJobId(),
						userAppliedEvent.getCandidateEmail());
				channel.basicAck(deliveryTag, false);
			} catch (Exception e) {
				channel.basicNack(deliveryTag, false, false);
			}
		}
	}

	@RabbitListener(queues = RabbitMQConfig.APPLICATION_BULK_QUEUE)
	public void consumApplicationBulkEvent(List<UserAppliedJobDTO> userAppliedEvents,
			@Header(AmqpHeaders.RECEIVED_ROUTING_KEY) String routingKey, Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {

		if (RabbitMQConfig.APPLICATION_EVENT_BULK_UPDATE.equals(routingKey)) {
			userAppliedJobService.updateBulkStatus(userAppliedEvents);
		}
	}

	private void onSuccess(ScoreResult tier1, Long applicationId, Channel channel, long deliveryTag) {
		try {
			ScoreResult scoreRespone = ScoreResult.builder().applicationId(applicationId)
					.finalScore(tier1.getFinalScore()).verdict(tier1.getVerdict())
					.tier2Eligible(tier1.getFinalScore() >= 0.45)
					.seniorityMismatchWarning(tier1.getSeniorityMismatchWarning())
					.jobTextSnapshot(tier1.getJobTextSnapshot()).build();

			rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.SCORING_APPLICATION,
					scoreRespone);

			channel.basicAck(deliveryTag, false);
		} catch (IOException e) {
			System.out.print("Failed to ack message for application {}" + applicationId + e.getMessage());
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
//			channel.basicNack(deliveryTag, false, true);
			channel.basicNack(deliveryTag, false, false);
		} catch (IOException e) {
//			log.error("Failed to nack message for application {}", applicationId, e);
		}
	}
}
