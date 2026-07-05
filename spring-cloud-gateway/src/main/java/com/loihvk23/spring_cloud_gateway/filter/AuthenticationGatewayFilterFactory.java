package com.loihvk23.spring_cloud_gateway.filter;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationGatewayFilterFactory
		extends AbstractGatewayFilterFactory<AuthenticationGatewayFilterFactory.Config> {

	@Value("${app.jwt.secret}")
	private String SECRET_KEY;

	public AuthenticationGatewayFilterFactory() {
		super(Config.class);
	}

	public static class Config {
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) -> {
			ServerHttpRequest request = exchange.getRequest();

			if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
				return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
			}

			String authHeader = request.getHeaders().getOrEmpty(HttpHeaders.AUTHORIZATION).get(0);
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				return onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);

			try {
				Claims claims = Jwts.parser()
						.verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8))).build()
						.parseSignedClaims(token).getPayload();

				String userEmail = claims.getSubject();
				String userRole = (String) claims.get("role");

				ServerHttpRequest modifiedRequest = request.mutate().header("X-User-Email", userEmail)
						.header("X-User-Role", userRole).build();

				return chain.filter(exchange.mutate().request(modifiedRequest).build());

			} catch (Exception e) {
				return onError(exchange, "Invalid Token or Token is expired!", HttpStatus.UNAUTHORIZED);
			}
		};
	}

	private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
		ServerHttpResponse response = exchange.getResponse();
		response.setStatusCode(httpStatus);
		return response.setComplete();
	}
}