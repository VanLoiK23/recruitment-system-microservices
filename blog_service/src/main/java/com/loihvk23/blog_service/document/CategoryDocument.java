package com.loihvk23.blog_service.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("categories")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDocument {
	@Id
	private String id;
	@Indexed
	private String name;
}
