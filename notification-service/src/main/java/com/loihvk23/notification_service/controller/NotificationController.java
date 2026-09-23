package com.loihvk23.notification_service.controller;

import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.notification_service.dto.CredentialNotificationDTO;
import com.loihvk23.notification_service.dto.TemplateDTO;
import com.loihvk23.notification_service.dto.request.NotificationRequest;
import com.loihvk23.notification_service.service.CredentialNotificationService;
import com.loihvk23.notification_service.service.NotificationService;
import com.loihvk23.notification_service.service.TemplateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("notificationResController")
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final TemplateService templateService;

	private final CredentialNotificationService credentialService;
	
	private final NotificationService notificationService;

	@GetMapping("/credentials")
	public ResponseEntity<CredentialNotificationDTO> getCredential(@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		return ResponseEntity.ok(credentialService.findByOwnerEmail(email));
	}

	@PostMapping("/credentials")
	public ResponseEntity<CredentialNotificationDTO> saveCredential(
			@RequestBody @Valid CredentialNotificationDTO credentialDTO, @AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		return ResponseEntity.ok(credentialService.saveCredential(credentialDTO, email));
	}

	@GetMapping("/templates")
	public ResponseEntity<Slice<TemplateDTO>> getTemplates(
			@RequestParam(required = false, defaultValue = "") String templateKey,
			@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		return ResponseEntity.ok(templateService.findByOwerEmailAndTemplateKey(email, templateKey, pageable));
	}

	@PostMapping("/templates")
	public ResponseEntity<TemplateDTO> createTemplate(@RequestBody @Valid TemplateDTO templateDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		return ResponseEntity.ok(templateService.saveTemplate(templateDTO, email, "ADD"));
	}

	@PutMapping("/templates/{id}")
	public ResponseEntity<TemplateDTO> updateTemplate(@PathVariable String id, @RequestBody @Valid TemplateDTO templateDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		templateDTO.setId(id);
		return ResponseEntity.ok(templateService.saveTemplate(templateDTO, email, "UPDATE"));
	}

	@DeleteMapping("/templates/{id}")
	public ResponseEntity<?> deleteTemplate(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		templateService.deleteTemplate(id, email);

		return ResponseEntity.ok(Map.of("success", true));
	}
	
	@PostMapping("/sent")
	public ResponseEntity<?> processSendBulkEmail(@RequestBody @Valid NotificationRequest request,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		notificationService.processBulkEmailRequest(request,email);
		return ResponseEntity.ok(Map.of("success", true));
	}
}