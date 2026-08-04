package com.loihvk23.job_service.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user_applied_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndexes({
    @CompoundIndex(name = "email_job_idx", def = "{'candidateEmail': 1, 'jobId': 1}")
})
public class UserAppliedJobDocument {
	@Id
	private String id;
	private String candidateEmail;
	private String jobId;
	private String status;
	private LocalDateTime createdAt;
}
