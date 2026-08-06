package com.loihvk23.blog_service.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.loihvk23.blog_service.BlogStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {
	private String id;

	private String title;

	private String content;

	private String thumbnailUrl;

	private String authorEmail;

	private String authorName;

	private String categoryId;

	private List<String> tags;

	@Builder.Default
	private BlogStatus status = BlogStatus.DRAFT;

	@Builder.Default
	private Long viewCount = 0L;

	private LocalDateTime createdAt;
}