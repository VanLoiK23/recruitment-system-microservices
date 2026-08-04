package com.loihvk23.job_service.config;

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

	public static final String JOB_QUEUE = "job.apply.queue";
	
	public static final String JOB_EXCHANGE = "job.exchange";
	public static final String JOB_UPSERTED_KEY = "job.event.upserted";
	public static final String JOB_DELETE_KEY = "job.event.deleted";

	public static final String KEY_JOB_APPLY_ALL_EVENTS_PATTERN = "job.apply.#";
	
	public static final String KEY_JOB_APPLIED_UPDATE = "job.apply.update";
	public static final String KEY_JOB_APPLIED_SAVE = "job.apply.save";
	public static final String KEY_JOB_APPLIED_DELETE = "job.apply.delete";

	@Bean
	public TopicExchange jobExchange() {
		return new TopicExchange(JOB_EXCHANGE);
	}
	
	@Bean
	public Queue jobQueue() {
		return new Queue(JOB_QUEUE, true);// if shutdown then data can't lost
	}
	
	//auto convert object to json
	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}
	
	@Bean
    public Binding bindJobApplied(Queue jobQueue, TopicExchange jobExchange) {
        return BindingBuilder.bind(jobQueue).to(jobExchange).with(KEY_JOB_APPLY_ALL_EVENTS_PATTERN);
    }
}
