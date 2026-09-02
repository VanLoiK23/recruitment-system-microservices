package com.loihvk23.job_service.service.client;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.mapper.JobMapper;
import com.loihvk23.job_service.repository.JobRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class CvJdScoreClientTier1 {

	private final WebClient cvJdWebClient;

	private final JobRepository jobRepository;

	private final JobMapper jobMapper;

	public record ScoreResult(double finalScore, double sbertScore, double skillScore, String verdict,
			boolean seniorityMismatchWarning) {
	}

	public Mono<ScoreResult> scoreSingle(String cvText, String jobId) {
		return findJobById(jobId).flatMap(job -> {
			JobDTO jobDTO = jobMapper.toDTO(job);
			String jobText = buildJobText(jobDTO);
			return scoreSingle(cvText, jobText, jobDTO.getJobLevel());
		});
	}

	private Mono<JobDocument> findJobById(String jobId) {
		return Mono.fromCallable(() -> jobRepository.findById(jobId).orElse(null))
				.subscribeOn(Schedulers.boundedElastic())
				.flatMap(job -> job == null ? Mono.error(new IllegalArgumentException("Job not found: " + jobId))
						: Mono.just(job));
	}

	public Mono<List<Map<String, Object>>> scoreBatch(String jobId, List<Map<String, Object>> candidates) {
		return findJobById(jobId).flatMap(job -> {
			JobDTO jobDTO = jobMapper.toDTO(job);
			String jobText = buildJobText(jobDTO);
			return scoreBatch(jobText, jobDTO.getJobLevel(), candidates);
		});
	}

	public Mono<ScoreResult> scoreSingle(String cvText, String jobText, String jobLevel) {
		return cvJdWebClient.post().uri("/score")
				.bodyValue(
						Map.of("cv_text", cvText, "job_text", jobText, "job_level", jobLevel == null ? "" : jobLevel))
				.retrieve().bodyToMono(ScoreResult.class);
	}

//	public ScoreResult scoreSingle(String cvText, String jobText, String jobLevel) {
//		return cvJdWebClient.post().uri("/score")
//				.bodyValue(
//						Map.of("cv_text", cvText, "job_text", jobText, "job_level", jobLevel == null ? "" : jobLevel))
//				.retrieve().bodyToMono(ScoreResult.class).block();
//	}

//	public List<Map<String, Object>> scoreBatch(String jobText, String jobLevel, List<Map<String, Object>> candidates) {
//		return cvJdWebClient
//				.post().uri("/score/batch").bodyValue(Map.of("job_text", jobText, "job_level",
//						jobLevel == null ? "" : jobLevel, "candidates", candidates))
//				.retrieve().bodyToMono(List.class).block();
//	}

	@SuppressWarnings("unchecked")
	public Mono<List<Map<String, Object>>> scoreBatch(String jobText, String jobLevel,
			List<Map<String, Object>> candidates) {
		return cvJdWebClient
				.post().uri("/score/batch").bodyValue(Map.of("job_text", jobText, "job_level",
						jobLevel == null ? "" : jobLevel, "candidates", candidates))
				.retrieve().bodyToMono(List.class).map(list -> (List<Map<String, Object>>) list);
	}

	private String buildJobText(JobDTO job) {
		StringBuilder sb = new StringBuilder();

		if (job.getTitle() != null) {
			sb.append(job.getTitle()).append(". ");
		}
		if (job.getDescription() != null) {
			sb.append(job.getDescription()).append(". ");
		}

		if (job.getCategories() != null && !job.getCategories().isEmpty()) {
			String specificCategory = job.getCategories().get(job.getCategories().size() - 1);
			sb.append("Position: ").append(specificCategory).append(". ");
		}

		if (job.getRoles() != null && !job.getRoles().isEmpty()) {
			sb.append("Responsibilities: ").append(String.join(" ", job.getRoles())).append(" ");
		}

		if (job.getTechnologies() != null && !job.getTechnologies().isEmpty()) {
			sb.append("Required technologies: ").append(String.join(", ", job.getTechnologies())).append(". ");
		}

		if (job.getRequirements() != null && !job.getRequirements().isEmpty()) {
			sb.append("Requirements: ").append(String.join(" ", job.getRequirements())).append(" ");
		}

		if (job.getJobLevel() != null) {
			sb.append("Seniority level: ").append(job.getJobLevel()).append(".");
		}

		return sb.toString().trim();
	}
}
