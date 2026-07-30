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

import com.loihvk23.profile_service.dto.ProfileDTO;
import com.loihvk23.profile_service.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController("profileController")
@RequiredArgsConstructor
@RequestMapping("/api/profile")
public class profileController {
	private final ProfileService profileService;
	
	@GetMapping
	public ResponseEntity<?> fechInfoProfile(@AuthenticationPrincipal UserDetails userDetails){
		String email = userDetails.getUsername();
		
		ProfileDTO profileDTO = profileService.findProfileByEmail(email);
		
		return ResponseEntity.ok(profileDTO);
	}
	
	@PostMapping
	public ResponseEntity<?> saveProfile(@RequestBody ProfileDTO profileDTO, @AuthenticationPrincipal UserDetails userDetails){
		String email = userDetails.getUsername();
		
		ProfileDTO profileSaveDto = profileService.saveProfile(profileDTO, email);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(profileSaveDto);
	}
}
