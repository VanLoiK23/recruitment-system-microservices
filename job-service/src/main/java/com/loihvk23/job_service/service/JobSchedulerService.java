package com.loihvk23.job_service.service;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.loihvk23.job_service.document.JobDocument;
import com.mongodb.client.result.UpdateResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSchedulerService {

	private final MongoTemplate mongoTemplate;

	@Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Ho_Chi_Minh")
	public void scheduleCloseExpiredJobs() {
		log.info("Start scan job is expired in MongoDB...");

		LocalDateTime now = LocalDateTime.now();

		Query query = new Query(Criteria.where("deadline").lt(now).and("status").is("ACTIVE"));

		Update update = new Update().set("status", "CLOSED");
		UpdateResult result = mongoTemplate.updateMulti(query, update, JobDocument.class);

		log.info("Complete scan. Result: ", result.getModifiedCount());
	}
}