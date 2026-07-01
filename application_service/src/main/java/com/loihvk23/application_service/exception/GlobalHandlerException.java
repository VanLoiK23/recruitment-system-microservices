package com.loihvk23.application_service.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.loihvk23.application_service.dto.response.ErrorResponse;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalHandlerException {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse<Map<String, String>>> handleValidationException(
			MethodArgumentNotValidException exp) {
		Map<String, String> errors = new HashMap<>();

		exp.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String messageDefault = error.getDefaultMessage();
			errors.put(fieldName, messageDefault);
		});

		ErrorResponse<Map<String, String>> errorResponse = ErrorResponse.<Map<String, String>>builder()
				.timestamp(LocalDateTime.now()).status(HttpStatus.BAD_REQUEST.value())
				.error(HttpStatus.BAD_REQUEST.getReasonPhrase()).message(errors).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(EntityExistsException.class)
	public ResponseEntity<ErrorResponse<String>> handleEntityExistException(EntityExistsException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.CONFLICT.value()).error(HttpStatus.CONFLICT.getReasonPhrase())
				.message(exp.getMessage()).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<ErrorResponse<String>> handleEntityNotFoundException(EntityNotFoundException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.NOT_FOUND.value()).error(HttpStatus.NOT_FOUND.getReasonPhrase())
				.message(exp.getMessage()).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse<String>> handleArgumentInvalidException(IllegalArgumentException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.BAD_REQUEST.value()).error(HttpStatus.BAD_REQUEST.getReasonPhrase())
				.message(exp.getMessage()).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}
	
	
	@ExceptionHandler(MissingServletRequestPartException.class)
	public ResponseEntity<ErrorResponse<String>> handleMissingServletRequestPartException(MissingServletRequestPartException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.NOT_FOUND.value()).error(HttpStatus.NOT_FOUND.getReasonPhrase())
				.message(exp.getMessage()).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse<String>> handleAccessDeniedException(AccessDeniedException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.FORBIDDEN.value()).error(HttpStatus.FORBIDDEN.getReasonPhrase())
				.message("You do not have permission to access this resource !!").build();

		return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse<String>> handleResourceNotFoundException(ResourceNotFoundException exp) {
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.NOT_FOUND.value()).error(HttpStatus.NOT_FOUND.getReasonPhrase())
				.message(exp.getMessage()).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse<String>> handleHttpMessageNotReadableException(
			HttpMessageNotReadableException exp) {
		String customizedMessage = "Dữ liệu gửi lên sai định dạng kiểu dữ liệu!";

		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.BAD_REQUEST.value()).error(HttpStatus.BAD_REQUEST.getReasonPhrase())
				.message(customizedMessage).build();

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ErrorResponse<String>> handleNotFoundResoucesException(NoResourceFoundException exp) {

		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.NOT_FOUND.value()).error(HttpStatus.NOT_FOUND.getReasonPhrase())
				.message("The requested resources do not exist., please try again later !!").build();

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ErrorResponse<String>> handleMissingRequestParamException(MissingServletRequestParameterException exp) {
	    
	    String parameterName = exp.getParameterName(); 
	    
	    String errorMessage = String.format("Param '%s' is required in request (Request)!", parameterName);

	    ErrorResponse<String> errorResponse = ErrorResponse.<String>builder()
	            .timestamp(LocalDateTime.now())
	            .status(HttpStatus.BAD_REQUEST.value()) 
	            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
	            .message(errorMessage)
	            .build();

	    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(MultipartException.class)
	public ResponseEntity<ErrorResponse<String>> handleMultipartException(MultipartException exp) {
		exp.printStackTrace();
		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.NOT_FOUND.value()).error(HttpStatus.NOT_FOUND.getReasonPhrase())
				.message("File CV is required").build();

		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse<String>> handleGlobalException(Exception exp) {
		exp.printStackTrace();

		ErrorResponse<String> errorResponse = ErrorResponse.<String>builder().timestamp(LocalDateTime.now())
				.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
				.message("The system has encountered an unexpected issue, please try again later !!").build();

		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}