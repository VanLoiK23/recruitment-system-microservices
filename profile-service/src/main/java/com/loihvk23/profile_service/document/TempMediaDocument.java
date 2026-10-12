package com.loihvk23.profile_service.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Data;

@Document(collection = "temp_medias")
@Data
@Builder
public class TempMediaDocument {
    @Id
    private String id;
    private String fileUrl; 
    private LocalDateTime createdAt;
}