package com.loihvk23.blog_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.blog_service.dto.BlogDTO;

public interface BlogService {
	Slice<BlogDTO> getBlogsSlice(Pageable pageable);

	Slice<BlogDTO> findBlogsByCategory(String category, Pageable pageable);

	BlogDTO saveBlog(String email, BlogDTO blogDTO);

	void deleteBlog(String email, String blogId);
}
