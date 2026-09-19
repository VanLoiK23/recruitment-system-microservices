package com.loihvk23.notification_service.config;

import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	public static final String JOB_EXCHANGE = "job.exchange";
	public static final String JOB_UPSERTED_KEY = "job.event.upserted";
	public static final String JOB_DELETE_KEY = "job.event.deleted";

	public static final String APPLICATION_QUEUE = "application.apply.queue";

	public static final String KEY_APPLICATION_APPLY_ALL_EVENTS_PATTERN = "application.event.#";

	public static final String APPLICATION_EVENT_SAVE = "application.event.save";
	public static final String APPLICATION_EVENT_UPDATE = "application.event.update";
	public static final String APPLICATION_EVENT_DELETE = "application.event.delete";

	public static final String APPLICATION_BULK_QUEUE = "application.bulk.queue";

	public static final String KEY_APPLICATION_BULK_ALL_EVENTS_PATTERN = "application.bulk.#";
	
	public static final String APPLICATION_EVENT_BULK_UPDATE = "application.bulk.update";

	public static final String SCORING_APPLICATION = "application.event.scored";

	@Bean
	public TopicExchange jobExchange() {
		return new TopicExchange(JOB_EXCHANGE);
	}

	@Bean
	public Queue applicationQueue() {
		return new Queue(APPLICATION_QUEUE, true);// if shutdown then data can't lost
	}
	
	@Bean
	public Queue applicationBulkQueue() {
		return new Queue(APPLICATION_BULK_QUEUE, true);
	}

	// auto convert object to json
	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public Binding bindApplicationApplied(Queue applicationQueue, TopicExchange jobExchange) {
		return BindingBuilder.bind(applicationQueue).to(jobExchange).with(KEY_APPLICATION_APPLY_ALL_EVENTS_PATTERN);
	}
	
	@Bean
	public Binding bindApplicationBulkApplied(Queue applicationBulkQueue, TopicExchange jobExchange) {
		return BindingBuilder.bind(applicationBulkQueue).to(jobExchange).with(KEY_APPLICATION_BULK_ALL_EVENTS_PATTERN);
	}

	// handle custom container message should been resent or not
	@Bean
	public SimpleRabbitListenerContainerFactory manualAckContainerFactory(ConnectionFactory connectionFactory,
			MessageConverter jsonMessageConverter) {

		SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
		factory.setConnectionFactory(connectionFactory);
		factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);// turn off config default ACK Auto spring
		factory.setMessageConverter(jsonMessageConverter);

		return factory;
	}
}
