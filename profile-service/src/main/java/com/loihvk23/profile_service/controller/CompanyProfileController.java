package com.loihvk23.profile_service.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.profile_service.dto.CompanyProfileDTO;
import com.loihvk23.profile_service.dto.response.ResponseUpload;
import com.loihvk23.profile_service.service.CompanyProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("CompanyProfileController")
@RequiredArgsConstructor
@RequestMapping("/api/profile/companies")
public class CompanyProfileController {
	private final CompanyProfileService companyProfileService;

	@GetMapping("/:id")
	public ResponseEntity<?> findCompanyById(@PathVariable String id) {
		CompanyProfileDTO companyProfileDTO = companyProfileService.findById(id);

		return ResponseEntity.ok(companyProfileDTO);
	}

	public ResponseEntity<?> getListNameCompanyByOwner(@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		List<String> nameCompanies = companyProfileService.findNameCompaniesByOwner(email);

		return ResponseEntity.ok(Map.of("nameCompanies", nameCompanies));
	}

	public ResponseEntity<?> getListCompanyByOwner(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<CompanyProfileDTO> companies = companyProfileService.findMyCompanies(email, pageable);

		return ResponseEntity.ok(companies);
	}

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file, @RequestParam("type") String type,// "logo","coverImage","businessLicense","gallery"
			@RequestParam(value = "companyId", required = false, defaultValue = "temp") String companyId)
			throws IOException {
		ResponseUpload responseUpload = companyProfileService.uploadMedia(file, type, companyId);

		return ResponseEntity.ok(responseUpload);
	}

	@PostMapping
	public ResponseEntity<?> saveCompanyProfile(@RequestBody @Valid CompanyProfileDTO companyProfileDTO,
			@AuthenticationPrincipal UserDetails userDetails) throws IllegalArgumentException, IOException {

		String email = userDetails.getUsername();
		String role = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).findFirst().orElse("");

		CompanyProfileDTO companySaveDto = companyProfileService.saveProfile(companyProfileDTO, email, role);

		return ResponseEntity.ok(companySaveDto);
	}
}
