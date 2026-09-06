package com.loihvk23.application_service.service.client;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loihvk23.application_service.dto.Tier2Result;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GeminiTier2Client {

	private final WebClient geminiWebClient;
	private final ObjectMapper objectMapper;

	@Value("${gemini.api.key}")
	private String apiKey;

	@Value("${gemini.model:gemini-2.5-flash}")
	private String model;

	private Map<String, Object> buildResponseSchema() {
		return Map.of("type", "object", "properties",
				Map.of("overall_match_score", Map.of("type", "double"), "matched_skills",
						Map.of("type", "array", "items", Map.of("type", "string")), "missing_skills",
						Map.of("type", "array", "items", Map.of("type", "string")), "experience_alignment",
						Map.of("type", "string"), "summary_comment", Map.of("type", "string")),
				"required", List.of("overall_match_score", "matched_skills", "missing_skills", "experience_alignment",
						"summary_comment"));
	}

	private String buildPrompt(String cvContent, String jobText) {
		return """
				You are an expert technical recruiter evaluating a candidate's CV against a job description.

				JOB DESCRIPTION:
				%s

				CANDIDATE CV:
				%s

				Evaluate this candidate honestly and specifically. Base matched_skills and missing_skills only on
				what is explicitly stated in the JD requirements/technologies. Keep summary_comment concise and
				factual, not generic praise.
				""".formatted(jobText, cvContent);
	}

	public Mono<Tier2Result> scoreDetailed(String cvContent, String jobText) {
		Map<String, Object> requestBody = Map.of("contents",
				List.of(Map.of("parts", List.of(Map.of("text", buildPrompt(cvContent, jobText))))), "generationConfig",
				Map.of("responseMimeType", "application/json", "responseSchema", buildResponseSchema()));

		return geminiWebClient.post()
				.uri(uriBuilder -> uriBuilder.path("/v1beta/models/{model}:generateContent").queryParam("key", apiKey)
						.build(model))
				.bodyValue(requestBody).retrieve().bodyToMono(JsonNode.class).map(this::parseGeminiResponse);
	}

	private Tier2Result parseGeminiResponse(JsonNode geminiResponse) {
		try {
			String innerJson = geminiResponse.path("candidates").get(0).path("content").path("parts").get(0)
					.path("text").asText();

			JsonNode parsed = objectMapper.readTree(innerJson);

			return new Tier2Result(parsed.path("overall_match_score").asDouble(),
					objectMapper.convertValue(parsed.path("matched_skills"), List.class),
					objectMapper.convertValue(parsed.path("missing_skills"), List.class),
					parsed.path("experience_alignment").asText(), parsed.path("summary_comment").asText());
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse Gemini response: " + geminiResponse, e);
		}
	}

	public String resolveCvContent(String cvSnapshotJson, String cvTextExtracted) {
		if (cvSnapshotJson != null && !cvSnapshotJson.isBlank()) {
			return cvSnapshotJson;
		}
		if (cvTextExtracted != null && !cvTextExtracted.isBlank()) {
			return cvTextExtracted;
		}
		throw new IllegalStateException("No CV content available (both cvSnapshotJson and cvTextExtracted are empty)");
	}
}