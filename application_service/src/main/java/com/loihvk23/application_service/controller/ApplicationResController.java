package com.loihvk23.application_service.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.dto.request.ApplicationRequest;
import com.loihvk23.application_service.service.ApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationResController {
	private final ApplicationService applicationService;

	@GetMapping("/job/{jobId}")
	public ResponseEntity<?> getApplicationsByJob(@PathVariable(name = "jobId") String jobId,
			@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "status", defaultValue = "") String status,
			@AuthenticationPrincipal UserDetails userDetails) {
		String emailRecruiter = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<ApplicationDTO> applicationDtoSlice = (status == null || status.isBlank())
				? applicationService.findApplicationsByJob(jobId, emailRecruiter, pageable)
				: applicationService.findApplicationsByJobAndStatus(jobId, status, emailRecruiter, pageable);

		return ResponseEntity.ok(applicationDtoSlice);
	}

	@GetMapping
	public ResponseEntity<?> getApplicationsByCandidate(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String emailCandidate = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<ApplicationDTO> applicationDtoSlice = applicationService.findApplicationsOfCandidate(emailCandidate,
				pageable);

		return ResponseEntity.ok(applicationDtoSlice);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDetailApplication(@PathVariable(name = "id") long applicationId,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		String roleWithPrefix = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).findFirst()
				.orElse("");

		if (roleWithPrefix == null || roleWithPrefix.isBlank()) {
			throw new IllegalArgumentException("User's role is required. This user has logged in without any role.");
		}

		String role = roleWithPrefix.replace("ROLE_", "");

		ApplicationDTO applicationDTO = applicationService.findDetailByCandidateOrRecruiter(applicationId, email, role);

		return ResponseEntity.ok(applicationDTO);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> postNewApplicationApply(
			@RequestPart("request") @Valid ApplicationRequest applicationRequest,
			@RequestPart("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails)
			throws IOException {
		String emailCandidate = userDetails.getUsername();

		ApplicationDTO applicationDTO = applicationService.postApplicationApplyJob(applicationRequest, file,
				emailCandidate);

		return ResponseEntity.status(HttpStatus.CREATED).body(applicationDTO);
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateStatusByRecruiter(@PathVariable(name = "id") long applicationId,
			@RequestParam(name = "status") String status, @AuthenticationPrincipal UserDetails userDetails) {
		String emailRecruiter = userDetails.getUsername();

		ApplicationDTO applicationDTO = applicationService.updateStatusApplication(applicationId, emailRecruiter,
				status);

		return ResponseEntity.ok(applicationDTO);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteApplicationByCandidate(@PathVariable(name = "id") long applicationId,
			@AuthenticationPrincipal UserDetails userDetails) {
		String emailCandidate = userDetails.getUsername();

		applicationService.deleteApplicationById(applicationId, emailCandidate);

		return ResponseEntity.ok(Map.of("message", "Delete successfully"));
	}
}
