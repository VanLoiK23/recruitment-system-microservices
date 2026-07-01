package com.loihvk23.job_service.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	public static final String JOB_EXCHANGE = "job.exchange";
	public static final String JOB_UPSERTED_KEY = "job.event.upserted";
	public static final String JOB_DELETE_KEY = "job.event.deleted";

	
	@Bean
	public TopicExchange jobExchange() {
		return new TopicExchange(JOB_EXCHANGE);
	}
	
	//auto convert object to json
	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}
}
