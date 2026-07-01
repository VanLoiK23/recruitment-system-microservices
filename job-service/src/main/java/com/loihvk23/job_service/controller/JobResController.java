package com.loihvk23.job_service.controller;

import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
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

import com.loihvk23.job_service.config.RabbitMQConfig;
import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.JobEvent;
import com.loihvk23.job_service.dto.request.JobSearchRequest;
import com.loihvk23.job_service.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobResController {

	private final JobService jobService;
	
	private final RabbitTemplate rabbitTemplate;

	@GetMapping
	public ResponseEntity<?> getListJobs(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<JobDTO> jobSlice = jobService.findAll(pageable);

		return ResponseEntity.ok(jobSlice);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDetailJob(@PathVariable(name = "id") String jobId) {

		JobDTO jobDTO = jobService.findDetailJob(jobId);

		return ResponseEntity.ok(jobDTO);
	}

	@PostMapping
	public ResponseEntity<JobDTO> createNewJob(@RequestBody @Valid JobDTO jobDTO,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();
		jobDTO.setRecruiterEmail(email);
		
		JobDTO jobSaveDto = jobService.createNewJob(jobDTO);
		
		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).recruiterEmail(email).status(jobSaveDto.getStatus()).build();
		
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_UPSERTED_KEY, jobEvent);

		return ResponseEntity.status(HttpStatus.CREATED).body(jobSaveDto);
	}

	@PutMapping("/{id}")
	public ResponseEntity<JobDTO> updateJob(@PathVariable(name = "id") String jobId, @RequestBody @Valid JobDTO jobDTO,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();

		jobDTO.setId(jobId);
		jobDTO.setRecruiterEmail(email);

		JobDTO jobSaveDto = jobService.updateJob(jobDTO, email);
		
		JobEvent jobEvent = JobEvent.builder().id(jobSaveDto.getId()).recruiterEmail(email).status(jobSaveDto.getStatus()).build();
		
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_UPSERTED_KEY, jobEvent);

		return ResponseEntity.ok(jobSaveDto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> updateJob(@PathVariable(name = "id") String jobId,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();

		JobEvent jobEvent = JobEvent.builder().id(jobId).build();
		
		rabbitTemplate.convertAndSend(RabbitMQConfig.JOB_EXCHANGE, RabbitMQConfig.JOB_DELETE_KEY, jobEvent);
		
		jobService.deleteJob(jobId, email);

		return ResponseEntity.ok(Map.of("message", "Delete Successfully !"));
	}

	@GetMapping("/filter")
	public ResponseEntity<?> filterAdvanceJobs(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "technology", defaultValue = "") String technology,
			@RequestParam(name = "minSalary", defaultValue = "0") Double minSalary,
			@RequestParam(name = "maxSalary", defaultValue = "0") Double maxSalary,
			@RequestParam(name = "jobLevel", defaultValue = "") String jobLevel,
			@RequestParam(name = "location", defaultValue = "") String location) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		JobSearchRequest searchRequest = JobSearchRequest.builder().technology(technology).minSalary(minSalary)
				.maxSalary(maxSalary).jobLevel(jobLevel).location(location).build();

		Slice<JobDTO> jobSlice = jobService.filterAdvanceJobs(searchRequest, pageable);

		return ResponseEntity.ok(jobSlice);
	}
}
