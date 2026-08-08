package com.loihvk23.job_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.AdvanceFilterRequest;
import com.loihvk23.job_service.dto.response.JobManagementResponse;
import com.loihvk23.job_service.service.JobService;
import com.loihvk23.job_service.service.SavedJobService;
import com.loihvk23.job_service.service.UserAppliedJobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobResController {

	private final JobService jobService;

	private final SavedJobService savedJobService;

	private final UserAppliedJobService userAppliedJobService;

	@GetMapping
	public ResponseEntity<?> getListJobs(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		String email = (userDetails != null) ? userDetails.getUsername() : null;

		Slice<JobDTO> jobSlice = jobService.findAll(pageable, email);

		return ResponseEntity.ok(jobSlice);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDetailJob(@PathVariable(name = "id") String id,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = (userDetails != null) ? userDetails.getUsername() : null;

		if (email != null) {
			jobService.saveViewedJobHistory(email, id);
		}

		JobDTO jobDTO = jobService.findDetailJob(id, email);

		return ResponseEntity.ok(jobDTO);
	}

	@GetMapping("/relevant")
	public ResponseEntity<?> getJobRelevants(@RequestParam(name = "technologies") List<String> technologies,
			@RequestParam(name = "jobId") String jobId, @RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = (userDetails != null) ? userDetails.getUsername() : null;

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<JobDTO> jobSlice = jobService.findJobRelevants(technologies, jobId, pageable, email);

		return ResponseEntity.ok(jobSlice);
	}

	@PostMapping
	public ResponseEntity<JobDTO> createNewJob(@RequestBody @Valid JobDTO jobDTO,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();
		jobDTO.setRecruiterEmail(email);

		JobDTO jobSaveDto = jobService.createNewJob(jobDTO, email);

		return ResponseEntity.status(HttpStatus.CREATED).body(jobSaveDto);
	}

	@PutMapping("/{id}")
	public ResponseEntity<JobDTO> updateJob(@PathVariable(name = "id") String jobId, @RequestBody @Valid JobDTO jobDTO,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();

		JobDTO jobSaveDto = jobService.updateJob(jobDTO, jobId, email);

		return ResponseEntity.ok(jobSaveDto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteJob(@PathVariable(name = "id") String jobId,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();

		jobService.deleteJob(jobId, email);

		return ResponseEntity.ok(Map.of("message", "Delete Successfully !"));
	}

	@PostMapping("/filter")
	public ResponseEntity<?> filterAdvanceJobs(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestBody AdvanceFilterRequest searchRequest, @AuthenticationPrincipal UserDetails userDetails) {
		String email = (userDetails != null) ? userDetails.getUsername() : null;
		Sort sort = Sort.by(Sort.Direction.DESC, sortBy);

		if (sortBy.contains("-")) {
			String[] arr = sortBy.split("-");

			String direction = arr[0];
			sortBy = arr[1];
			if (direction.equals("asc")) {
				sort = Sort.by(Sort.Direction.ASC, sortBy);
			} else {
				sort = Sort.by(Sort.Direction.DESC, sortBy);
			}
		}
		Pageable pageable = PageRequest.of(page - 1, limit, sort);

		Page<JobDTO> jobPage = jobService.filterAdvanceJobs(searchRequest, pageable, email);

		return ResponseEntity.ok(jobPage);
	}

	@PostMapping("/{jobId}/saveJob")
	public ResponseEntity<?> saveJob(@PathVariable("jobId") String jobId,
			@AuthenticationPrincipal UserDetails userDetails) {
		if (jobId == null) {
			throw new IllegalArgumentException("Job Id is required");
		}
		String email = userDetails.getUsername();

		boolean isSaved = savedJobService.saveJob(jobId, email);

		return ResponseEntity.ok(Map.of("isSuccess", isSaved));
	}

	@GetMapping("/{jobId}/is-saved")
	public ResponseEntity<?> checkJobSaved(@PathVariable("jobId") String jobId,
			@AuthenticationPrincipal UserDetails userDetails) {
		if (jobId == null) {
			throw new IllegalArgumentException("Job Id is required");
		}
		if (userDetails == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		String email = userDetails.getUsername();

		boolean isSaved = savedJobService.checkJobIsSaved(jobId, email);

		return ResponseEntity.ok(Map.of("isSaved", isSaved));
	}

	@GetMapping("/saved")
	public ResponseEntity<?> getMyJobSaved(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<JobManagementResponse> jobs = savedJobService.findSavedJobsByUser(email, pageable);

		return ResponseEntity.ok(jobs);
	}

	@GetMapping("/viewed")
	public ResponseEntity<?> getMyJobViewed(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<JobManagementResponse> jobs = jobService.getViewdJobs(email, pageable);

		return ResponseEntity.ok(jobs);
	}

	@GetMapping("/applied")
	public ResponseEntity<?> getMyJobApplied(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<JobManagementResponse> jobs = userAppliedJobService.findAppliedJobsByUser(email, pageable);

		return ResponseEntity.ok(jobs);
	}
}
