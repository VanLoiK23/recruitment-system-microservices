package com.loihvk23.application_service.config;

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

	public static final String JOB_QUEUE = "job.application.queue";
	public static final String JOB_EXCHANGE = "job.exchange";

	public static final String JOB_ALL_EVENTS_PATTERN = "job.event.#";

	public static final String JOB_UPSERTED_KEY = "job.event.upserted";
	public static final String JOB_DELETE_KEY = "job.event.deleted";
	
	
	public static final String APPLICATION_EVENT_SAVE = "application.event.save";
	public static final String APPLICATION_EVENT_UPDATE = "application.event.update";
	public static final String APPLICATION_EVENT_DELETE = "application.event.delete";
	
	public static final String APPLICATION_EVENT_BULK_UPDATE = "application.bulk.update";
	
	public static final String APPLICATION_QUEUE = "candidate.applied.queue"; 
	public static final String APPLICATION_ALL_EVENTS_PATTERN = "application.event.#";
	public static final String SCORING_APPLICATION = "application.event.scored";

	public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
	public static final String ROUTING_KEY_REJECT_TO_CANDIDATE = "notification.email.reject_to_candidate";
	
	@Bean
	public TopicExchange jobExchange() {
		return new TopicExchange(JOB_EXCHANGE);
	}

	@Bean
	public Queue jobQueue() {
		return new Queue(JOB_QUEUE, true);// if shutdown then data can't lost
	}
	
	@Bean
	public Queue applicationQueue() {
		return new Queue(APPLICATION_QUEUE, true);
	}

	// auto convert object to json
	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	//catch all event start with job.event
	@Bean
	public Binding bindingJob(Queue jobQueue, TopicExchange jobExchange) {
		return BindingBuilder.bind(jobQueue).to(jobExchange).with(JOB_ALL_EVENTS_PATTERN);
	}
	
	@Bean
	public Binding bindingApplication(Queue applicationQueue, TopicExchange jobExchange) {
		return BindingBuilder.bind(applicationQueue).to(jobExchange).with(APPLICATION_ALL_EVENTS_PATTERN);
	}
}
