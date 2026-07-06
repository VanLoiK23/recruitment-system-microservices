package com.loihvk23.spring_cloud_gateway.filter;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationGatewayFilterFactory
		extends AbstractGatewayFilterFactory<AuthenticationGatewayFilterFactory.Config> {

//	@Value("${app.jwt.secret}")
//	private String SECRET_KEY;
	private static final String SECRE_KEY = "a4558b80-6594-4f4f-910b-1bc2ca62dfbf";

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
						.verifyWith(Keys.hmacShaKeyFor(SECRE_KEY.getBytes(StandardCharsets.UTF_8))).build()
						.parseSignedClaims(token).getPayload();

				String userEmail = claims.getSubject();
				String userRole = (String) claims.get("role");
				
				ServerHttpRequest modifiedRequest = request.mutate().header("X-User-Email", userEmail)
						.header("X-User-Roles", userRole).build();

				return chain.filter(exchange.mutate().request(modifiedRequest).build());

			} catch (Exception e) {
//				e.printStackTrace();
				return onError(exchange, "Invalid Token or Token is expired!", HttpStatus.UNAUTHORIZED);
			}
		};
	}

	private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
	    ServerHttpResponse response = exchange.getResponse();
	    
	    response.setStatusCode(httpStatus);
	    response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

	    Map<String, Object> errorDetails = Map.of(
	        "timestamp", LocalDateTime.now().toString(),
	        "status", httpStatus.value(),
	        "error", httpStatus.getReasonPhrase(),
	        "message", err 
	    );

	    try {
	        ObjectMapper objectMapper = new ObjectMapper();
	        byte[] bytes = objectMapper.writeValueAsBytes(errorDetails);
	        
	        DataBuffer buffer = response.bufferFactory().wrap(bytes);
	        return response.writeWith(Mono.just(buffer));
	        
	    } catch (Exception e) {
	    	e.printStackTrace();
	        return response.setComplete();
	    }
	}
}