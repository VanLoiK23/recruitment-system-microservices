package com.loihvk23.blog_service.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.loihvk23.blog_service.BlogStatus;

import jakarta.validation.constraints.NotBlank;
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

	@NotBlank(message = "Title is requied")
	private String title;

	@NotBlank(message = "Content is requied")
	private String content;

	@NotBlank(message = "Url image is requied")
	private String thumbnailUrl;

	private String authorEmail;

	@NotBlank(message = "Author's name is requied")
	private String authorName;

	@NotBlank(message = "Category is requied")
	private String categoryId;

	private List<String> tags;

	@Builder.Default
	private BlogStatus status = BlogStatus.DRAFT;

	@Builder.Default
	private Long viewCount = 0L;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
	private LocalDateTime createdAt;
}