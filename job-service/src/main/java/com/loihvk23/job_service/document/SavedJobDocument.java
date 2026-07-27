package com.loihvk23.job_service.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "saved_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedJobDocument {

    @Id
    private String id;

    private String userEmail;    
    private String jobId;  
    
    private LocalDateTime createdAt;
}
