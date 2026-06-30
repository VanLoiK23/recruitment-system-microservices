package com.loihvk23.auth_service.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse<T> {
	private LocalDateTime timestamp;
	private int status;
	private String error;
	private T message;
}