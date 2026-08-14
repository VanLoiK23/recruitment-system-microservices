package com.loihvk23.blog_service.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.management.relation.Role;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.blog_service.BlogStatus;
import com.loihvk23.blog_service.dto.BlogDTO;
import com.loihvk23.blog_service.dto.response.BlogPostedResponse;
import com.loihvk23.blog_service.service.BlogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("BlogResController")
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
	private final BlogService blogService;

	@GetMapping
	public ResponseEntity<?> filterBlogsByTitleAndCategory(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "query", defaultValue = "", required = false) String searchQuery,
			@RequestParam(name = "category", defaultValue = "", required = false) String category) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<BlogDTO> blogs = blogService.findBlogsByTitleAndCategory(searchQuery, category, pageable);

		return ResponseEntity.ok(blogs);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDetailBlog(@PathVariable(name = "id", required = true) String blogId) {
		BlogDTO blog = blogService.findByIdWatch(blogId);

		return ResponseEntity.ok(blog);
	}

	@GetMapping("/relevant")
	public ResponseEntity<?> gẹtBlogRelevantTag(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "tags", required = false) String tags) {
		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		Slice<BlogDTO> blogs = blogService.findBlogRelevantTag(tags, pageable);

		return ResponseEntity.ok(blogs);
	}

	@PostMapping
	public ResponseEntity<?> createBlog(@RequestBody @Valid BlogDTO blogDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());
		String role = (roles.size() > 0) ? roles.get(0) : null;

		BlogDTO blog = blogService.createBlog(blogDTO, email, role);

		return ResponseEntity.ok(blog);
	}

	@PutMapping
	public ResponseEntity<?> updateBlog(@RequestBody @Valid BlogDTO blogDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());
		String role = (roles.size() > 0) ? roles.get(0) : null;

		BlogDTO blog = blogService.updateBlog(blogDTO, email, role);

		return ResponseEntity.ok(blog);
	}

	@PutMapping("/approve/{id}")
	public ResponseEntity<?> approveBlog(@PathVariable(name = "id", required = true) String blogId) {
		BlogDTO blog = blogService.updateStatusByAdmin(blogId, BlogStatus.PUBLISHED);

		return ResponseEntity.ok(blog);
	}
	
	@PutMapping("/reject/{id}")
	public ResponseEntity<?> rejectBlog(@PathVariable(name = "id", required = true) String blogId) {
		BlogDTO blog = blogService.updateStatusByAdmin(blogId, BlogStatus.REJECTED);

		return ResponseEntity.ok(blog);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteBlog(@PathVariable(name = "id") String blogId,
			@AuthenticationPrincipal UserDetails userDetails) {

		String email = userDetails.getUsername();
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());
		String role = (roles.size() > 0) ? roles.get(0) : null;

		blogService.deleteBlog(blogId, email, role);

		return ResponseEntity.ok(Map.of("isSuccess", true));
	}

	@GetMapping("/posted")
	public ResponseEntity<?> getBlogPosted(@RequestParam(name = "page", defaultValue = "1") int page,
			@RequestParam(name = "limit", defaultValue = "7") int limit,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "query", defaultValue = "", required = false) String searchQuery,
			@RequestParam(name = "status", defaultValue = "", required = false) String status,
			@RequestParam(name = "category", defaultValue = "", required = false) String category,
			@AuthenticationPrincipal UserDetails userDetails) {
		String email = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, sortBy));

		BlogPostedResponse blogPostedResponse = blogService.findBlogsPosted(email, searchQuery, category, status, pageable);

		return ResponseEntity.ok(blogPostedResponse);
	}
}
