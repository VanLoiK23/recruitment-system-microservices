package com.loihvk23.notification_service.service.impl;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.loihvk23.notification_service.config.RabbitMQConfig;
import com.loihvk23.notification_service.document.TemplateDocument;
import com.loihvk23.notification_service.dto.request.NotificationEvent;
import com.loihvk23.notification_service.dto.request.NotificationRejectEvent;
import com.loihvk23.notification_service.dto.request.NotificationRequest;
import com.loihvk23.notification_service.repository.TemplateRepository;
import com.loihvk23.notification_service.service.NotificationService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private final JavaMailSenderImpl mailSender;

	private final TemplateRepository templateRepository;

	private final RabbitTemplate rabbitTemplate;

	@Value("${url.front-end}")
	private String url;

	@Override
	public boolean sendOTPEmail(NotificationEvent event) {
		String toEmail = event.getEmail();
		String OTP = event.getOtpOrResetToken();
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("TechRoute - Verify your identity");

			StringBuilder htmlContent = new StringBuilder();
			htmlContent.append(
					"<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eef0fc; rounded-top: 11px;'>")
					.append("<div style='text-align: center; margin-bottom: 24px;'>")
					.append("<h2 style='color: #5B5FC7; margin: 0; font-size: 22px;'>TechRoute</h2>")
					.append("<p style='color: #00C3FF; font-size: 14px; margin: 5px 0 0 0; font-weight: bold;'>Find your dream job</p>")
					.append("</div>")
					.append("<div style='background-color: #FAFAFB; padding: 24px; border-radius: 11px; text-align: center; border: 1px solid #eef0fc;'>")
					.append("<h3 style='color: #333333; margin-top: 0; font-size: 16px;'>Identity Verification</h3>")
					.append("<p style='color: #666666; font-size: 13px; line-height: 1.6;'>Thank you for choosing TechRoute. Please use the following 6-digit One-Time Password (OTP) to complete your registration procedure. This code is valid for 5 minutes.</p>")
					.append("<div style='margin: 24px 0; padding: 12px; background-color: #E0F7FF; border: 1px dashed #00C3FF; border-radius: 8px; display: inline-block; letter-spacing: 6px; font-size: 26px; font-weight: bold; color: #5B5FC7;'>")
					.append(OTP).append("</div>")
					.append("<p style='color: #999999; font-size: 11px; margin-bottom: 0;'>If you did not request this code, please ignore this email safely.</p>")
					.append("</div>")
					.append("<p style='margin-top: 24px; font-size: 12px; color: #666666; text-align: center;'>Best regards,<br><strong>TechRoute Operations Team</strong></p>")
					.append("</div>");

			helper.setText(htmlContent.toString(), true);

			mailSender.send(message);

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean sendResetEmail(NotificationEvent event) {
		String toEmail = event.getEmail();
		String token = event.getOtpOrResetToken();
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("TechRoute - Link reset your password");

			String resetLink = url + "reset-password/" + token;

			StringBuilder htmlContent = new StringBuilder();
			htmlContent.append(
					"<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eef0fc; border-radius: 11px;'>")
					.append("<h2 style='color: #5B5FC7;'>TechRoute - Reset Your Password</h2>")
					.append("<p style='color: #666666; font-size: 13px; line-height: 1.6;'>We received a request to reset your password. Click the button below to change your password. This link is valid for 15 minutes.</p>")
					.append("<div style='text-align: center; margin: 30px 0;'>").append("<a href='").append(resetLink)
					.append("' style='background-color: #00C3FF; color: white; padding: 12px 30px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;'>Reset Password</a>")
					.append("</div>")
					.append("<p style='color: #999999; font-size: 11px;'>If you did not request a password reset, please ignore this email.</p>")
					.append("</div>");

			helper.setText(htmlContent.toString(), true);

			mailSender.send(message);

			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public void sendEmailToCandidates(String authorEmail, NotificationRequest notificationRequest) {
		TemplateDocument templateDocument = templateRepository
				.findByOwnerEmailAndTemplateKey(authorEmail, notificationRequest.getTemplateKey())
				.orElseThrow(() -> new IllegalArgumentException("Can't find any TEMPLATE with the key"));

		String adjustSubject = replaceVariables(templateDocument.getSubject(), notificationRequest.getJobTitle(),
				notificationRequest.getInterviewDate());
		String adjustHtmlContent = replaceVariables(templateDocument.getHtmlContent(),
				notificationRequest.getJobTitle(), notificationRequest.getInterviewDate());

		if (notificationRequest.getReceivers() != null) {
			for (NotificationRequest.ReceiverInfo receiver : notificationRequest.getReceivers()) {
				try {
					String finalSubject = replaceVariables(adjustSubject, receiver.getName());
					String finalHtmlContent = replaceVariables(adjustHtmlContent, receiver.getName());

					MimeMessage message = mailSender.createMimeMessage();
					MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

					helper.setTo(receiver.getEmail());
					helper.setSubject(finalSubject);
					helper.setText(finalHtmlContent, true);

					mailSender.send(message);

					System.out.println("Send email success:" + receiver.getEmail());
				} catch (Exception e) {
					System.err.println("Send email error: " + receiver.getEmail() + ": " + e.getMessage());
				}
			}
		}

	}

	// convert asyn task
	@Override
	public void processBulkEmailRequest(NotificationRequest request, String authorEmail) {
		request.setAuthorEmail(authorEmail);
		rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_EXCHANGE,
				RabbitMQConfig.ROUTING_KEY_SENT_TO_CANDIDATE, request);
	}

	@Override
	public void sendEmailRejectToCandidates(String authorEmail, NotificationRejectEvent request) {
		// template reject default
		String templateRejectKey = "reject_template";

		String rejectPatern = "reject";

		TemplateDocument templateDocument = templateRepository
				.findByOwnerEmailAndTemplateKeyContaining(authorEmail, rejectPatern)
				.orElse(templateRepository.findByTemplateKeyContaining(templateRejectKey).orElse(null));

		if (templateDocument == null) {
			return;
		}

		String adjustSubject = replaceVariables(templateDocument.getSubject(), request.getJobTitle(), null);
		String adjustHtmlContent = replaceVariables(templateDocument.getHtmlContent(), request.getJobTitle(), null);

		if (request.getReceivers() != null) {
			for (NotificationRejectEvent.ReceiverInfo receiver : request.getReceivers()) {
				try {
					String finalSubject = replaceVariables(adjustSubject, receiver.getName());
					String finalHtmlContent = replaceVariables(adjustHtmlContent, receiver.getName());

					MimeMessage message = mailSender.createMimeMessage();
					MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

					helper.setTo(receiver.getEmail());
					helper.setSubject(finalSubject);
					helper.setText(finalHtmlContent, true);

					mailSender.send(message);

					System.out.println("Send email success:" + receiver.getEmail());
				} catch (Exception e) {
					System.err.println("Send email error: " + receiver.getEmail() + ": " + e.getMessage());
				}
			}
		}

	}

	private String replaceVariables(String rawText, String jobTitle, String interviewDate) {
		if (rawText == null || rawText.isEmpty()) {
			return "";
		}

		return rawText.replace("{{jobTitle}}", jobTitle != null ? jobTitle : "").replace("{{interviewDate}}",
				interviewDate != null ? interviewDate : "");
	}

	private String replaceVariables(String rawText, String nameCandidate) {
		if (rawText == null || rawText.isEmpty()) {
			return "";
		}

		return rawText.replace("{{candidateName}}", nameCandidate != null ? nameCandidate : "");
	}

}
