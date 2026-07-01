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
	public static final String JOB_UPSERTED_KEY = "job.event.upserted";
	public static final String JOB_DELETE_KEY = "job.event.deleted";

	public static final String JOB_ALL_EVENTS_PATTERN = "job.event.#";
	
	@Bean
	public TopicExchange jobExchange() {
		return new TopicExchange(JOB_EXCHANGE);
	}

	@Bean
	public Queue jobQueue() {
		return new Queue(JOB_QUEUE, true);// if shutdown then data can't lost
	}

	// auto convert object to json
	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	//catch all event start with job.event
	@Bean
	public Binding binding(Queue jobQueue, TopicExchange jobExchange) {
		return BindingBuilder.bind(jobQueue).to(jobExchange).with(JOB_ALL_EVENTS_PATTERN);
	}
}
