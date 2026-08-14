package com.loihvk23.blog_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final HeaderAuthenticationFilter headerAuthenticationFilter;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable())
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.GET, "/api/blogs/**").permitAll()

						.requestMatchers(HttpMethod.PUT, "/api/blogs/approve/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/blogs/reject/**").hasRole("ADMIN")
						
						.requestMatchers(HttpMethod.POST, "/api/blogs/**").hasAnyRole("RECRUITER", "ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/blogs/**").hasAnyRole("RECRUITER", "ADMIN")

						.requestMatchers(HttpMethod.DELETE, "/api/blogs/**").hasAnyRole("RECRUITER", "ADMIN")

						.requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
						
						.requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
						.anyRequest().authenticated())
				// turn off session in system, make sure STATE LESS
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
