package com.loihvk23.blog_service.service;

import java.io.IOException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.blog_service.BlogStatus;
import com.loihvk23.blog_service.dto.BlogDTO;
import com.loihvk23.blog_service.dto.response.BlogPostedResponse;

public interface BlogService {
	Slice<BlogDTO> getBlogsSlice(Pageable pageable);

	Slice<BlogDTO> findBlogsByTitleAndCategory(String searchQuery, String category, Pageable pageable);

	Slice<BlogDTO> findBlogRelevantTag(String allTags, Pageable pageable);

	BlogDTO findById(String blogId);

	BlogDTO findByIdWatch(String blogId);

	BlogDTO updateStatusByAdmin(String blogId, BlogStatus status);

	BlogDTO saveBlogDraft(BlogDTO blogDTO, MultipartFile thumbnailFile, String email) throws IOException;

	BlogDTO fetchBlogDraft(String email);

	BlogDTO createBlog(BlogDTO blogDTO, MultipartFile thumbnailFile, String email, String role) throws IOException;

	BlogDTO updateBlog(String blogId, BlogDTO blogDTO, MultipartFile thumbnailFile, String email, String role) throws IOException;

	void deleteBlog(String blogId, String email, String role) throws IOException;

	BlogPostedResponse findBlogsPosted(String recruiterEmail, String searchQuery, String category, String status,
			Pageable pageable);
}
