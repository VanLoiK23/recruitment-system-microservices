package com.loihvk23.blog_service.document;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.loihvk23.blog_service.BlogStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("blogs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BlogDocument {
	@Id
	private String id;

	private String title;

	private String content;

	@Field(name = "thumbnail_url")
	private String thumbnailUrl;

	@Field(name = "author_email")
	private String authorEmail;

	@Field(name = "author_name")
	private String authorName;

	@Field(name = "category_id")
	private String categoryId;

	//auto map category if call get field (except id)
//	@DocumentReference(lazy = true)
//	private CategoryDocument category;

	private List<String> tags;

	@Builder.Default
	private BlogStatus status = BlogStatus.DRAFT;

	private String reason;

	@Field(name = "view_count")
	@Builder.Default
	private Long viewCount = 0L;

	@Field(name = "created_at")
	private LocalDateTime createdAt;
}