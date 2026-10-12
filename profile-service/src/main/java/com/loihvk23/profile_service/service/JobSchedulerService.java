package com.loihvk23.profile_service.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.loihvk23.profile_service.document.TempMediaDocument;
import com.loihvk23.profile_service.repository.TempMediaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSchedulerService {

	private final FileStorageService fileStorageService;

	private final TempMediaRepository tempMediaRepository;

	@Scheduled(cron = "0 0 2 * * ?", zone = "Asia/Ho_Chi_Minh")
	public void cleanUpGarbageTempFiles() throws IOException {
		log.info("Start scanning for abandoned uploaded files...");

		LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
		List<TempMediaDocument> garbageFiles = tempMediaRepository.findByCreatedAtBefore(yesterday);

		for (TempMediaDocument doc : garbageFiles) {
			fileStorageService.deleteFile(doc.getFileUrl());

			tempMediaRepository.delete(doc);
		}

		log.info("Successfully cleaned up {} abandoned files.", garbageFiles.size());
	}
}