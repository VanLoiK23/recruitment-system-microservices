package com.loihvk23.application_service.config;

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

//	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	private final HeaderAuthenticationFilter headerAuthenticationFilter;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable()).authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.GET, "/api/applications/job/**").hasRole("RECRUITER") // fetch list
																									// application
																									// follow
																									// job

				.requestMatchers(HttpMethod.PUT, "/api/applications/*/status").hasRole("RECRUITER") // update
																									// status
																									// application
				.requestMatchers(HttpMethod.GET, "/api/applications/cv").hasRole("CANDIDATE")
				.requestMatchers(HttpMethod.GET, "/api/applications").hasRole("CANDIDATE") // candidate watch
																							// all application
				.requestMatchers(HttpMethod.GET, "/api/applications/profile/**").hasRole("CANDIDATE")
				.requestMatchers(HttpMethod.POST, "/api/applications").hasRole("CANDIDATE")

				.requestMatchers(HttpMethod.DELETE, "/api/applications/**").hasRole("CANDIDATE")

				.requestMatchers(HttpMethod.GET, "/api/applications/**").hasAnyRole("RECRUITER", "CANDIDATE")

				.anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
