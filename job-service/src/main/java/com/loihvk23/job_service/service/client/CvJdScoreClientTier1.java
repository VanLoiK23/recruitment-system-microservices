package com.loihvk23.job_service.service.client;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CvJdScoreClientTier1 {

	private final WebClient webClient;

	public CvJdScoreClientTier1(@Value("${cv.jd.service.url}") String serviceUrl) {
		this.webClient = WebClient.builder().baseUrl(serviceUrl).build();
	}

	public record ScoreResult(double finalScore, double sbertScore, double skillScore, String verdict,
			boolean seniorityMismatchWarning) {
	}

	public ScoreResult scoreSingle(String cvText, String jobText, String jobLevel) {
		return webClient.post().uri("/score")
				.bodyValue(
						Map.of("cv_text", cvText, "job_text", jobText, "job_level", jobLevel == null ? "" : jobLevel))
				.retrieve().bodyToMono(ScoreResult.class).block();
	}

	public List<Map<String, Object>> scoreBatch(String jobText, String jobLevel, List<Map<String, Object>> candidates) {
		return webClient
				.post().uri("/score/batch").bodyValue(Map.of("job_text", jobText, "job_level",
						jobLevel == null ? "" : jobLevel, "candidates", candidates))
				.retrieve().bodyToMono(List.class).block();
	}
}
