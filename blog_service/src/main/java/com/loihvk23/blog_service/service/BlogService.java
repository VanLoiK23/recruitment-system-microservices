package com.loihvk23.blog_service.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.blog_service.dto.BlogDTO;

public interface BlogService {
	Slice<BlogDTO> getBlogsSlice(Pageable pageable);

	Slice<BlogDTO> findBlogsByTitleAndCategory(String searchQuery, String category, Pageable pageable);
	
	Slice<BlogDTO> findBlogRelevantTag(String allTags, Pageable pageable);
	
	BlogDTO findById(String blogId);
	
	BlogDTO findByIdWatch(String blogId);
	
	BlogDTO approveBlog(String blogId);

	BlogDTO createBlog(BlogDTO blogDTO,String email, String role);
	
	BlogDTO updateBlog(BlogDTO blogDTO,String email, String role);

	void deleteBlog(String blogId, String email, String role);
}
