package com.loihvk23.profile_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.profile_service.dto.CandidateProfileDTO;
import com.loihvk23.profile_service.dto.RecruiterProfileDTO;
import com.loihvk23.profile_service.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController("profileController")
@RequiredArgsConstructor
@RequestMapping("/api/profile")
public class profileController {
	private final ProfileService profileService;

	@GetMapping("/candidate")
	public ResponseEntity<?> fechInfoCandidateProfile(@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		CandidateProfileDTO candidateProfileDTO = profileService.findCandidateProfileByEmail(email);

		return ResponseEntity.ok(candidateProfileDTO);
	}

	@PostMapping("/candidate")
	public ResponseEntity<?> saveCandidateProfile(@RequestBody CandidateProfileDTO candidateProfileDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		CandidateProfileDTO profileSaveDto = profileService.saveCandidateProfile(candidateProfileDTO, email);

		return ResponseEntity.status(HttpStatus.CREATED).body(profileSaveDto);
	}

	@GetMapping("/recruiter")
	public ResponseEntity<?> fechInfoRecruiterProfile(@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		RecruiterProfileDTO recruiterProfileDTO = profileService.findRecruiterProfileByEmail(email);

		return ResponseEntity.ok(recruiterProfileDTO);
	}

	@PostMapping("/recruiter")
	public ResponseEntity<?> saveRecruiterProfile(@RequestBody RecruiterProfileDTO recruiterProfileDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		RecruiterProfileDTO profileSaveDto = profileService.saveRecruiterProfile(recruiterProfileDTO, email);

		return ResponseEntity.status(HttpStatus.CREATED).body(profileSaveDto);
	}
}
