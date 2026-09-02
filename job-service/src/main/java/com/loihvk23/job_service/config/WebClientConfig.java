package com.loihvk23.job_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

	@Value("${cv.jd.service.url}")
	private String serviceUrl;

	@Bean
	public WebClient cvJdWebClient() {
		return WebClient.builder().baseUrl(serviceUrl).build();
	}
}