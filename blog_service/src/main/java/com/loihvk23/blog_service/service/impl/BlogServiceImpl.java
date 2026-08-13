package com.loihvk23.blog_service.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.loihvk23.blog_service.BlogStatus;
import com.loihvk23.blog_service.document.BlogDocument;
import com.loihvk23.blog_service.dto.BlogDTO;
import com.loihvk23.blog_service.dto.response.BlogPostedResponse;
import com.loihvk23.blog_service.mapper.BlogMapper;
import com.loihvk23.blog_service.repository.BlogRepository;
import com.loihvk23.blog_service.repository.CategoryRepository;
import com.loihvk23.blog_service.service.BlogService;

import io.jsonwebtoken.lang.Arrays;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
	private final BlogRepository blogRepository;

	private final BlogMapper blogMapper;

	private final CategoryRepository categoryRepository;

	private final MongoTemplate mongoTemplate;

	@Override
	public Slice<BlogDTO> getBlogsSlice(Pageable pageable) {

		Slice<BlogDocument> blogsDocument = blogRepository.findAllBy(pageable);

		Slice<BlogDTO> blogs = blogsDocument.map(blogMapper::toDTO);

		return blogs;
	}

	@Override
	public Slice<BlogDTO> findBlogsByTitleAndCategory(String searchQuery, String category, Pageable pageable) {
		boolean hasQuery = searchQuery != null && !searchQuery.isBlank();
		boolean hasCategory = category != null && !category.isBlank() && !"All".equalsIgnoreCase(category);

		Slice<BlogDocument> blogsDocument;
		String statusPublish = "PUBLISHED";

		if (hasQuery && hasCategory) {
			blogsDocument = blogRepository.findByTitleContainingIgnoreCaseAndCategoryIdAndStatus(searchQuery, category,
					statusPublish, pageable);
		} else if (hasQuery) {
			blogsDocument = blogRepository.findByTitleContainingIgnoreCaseAndStatus(searchQuery, statusPublish,
					pageable);
		} else if (hasCategory) {
			blogsDocument = blogRepository.findByCategoryIdAndStatus(category, statusPublish, pageable);
		} else {
			return getBlogsSlice(pageable);
		}

		return blogsDocument.map(blogMapper::toDTO);
	}

	@Override
	public Slice<BlogDTO> findBlogRelevantTag(String allTags, Pageable pageable) {
		if (allTags == null || allTags.isBlank()) {
			throw new IllegalArgumentException("Tags is required");
		}

		String[] tags = allTags.split(",");

		if (tags == null || tags.length == 0) {
			throw new IllegalArgumentException("Tags is required");
		}
		String statusPublish = "PUBLISHED";

		Slice<BlogDocument> blogsDocument = blogRepository.findByTagsInAndStatus(Arrays.asList(tags), statusPublish,
				pageable);

		Slice<BlogDTO> blogs = blogsDocument.map(blogMapper::toDTO);

		return blogs;
	}

	@Override
	public BlogDTO findById(String blogId) {
		BlogDocument blogDocument = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("Blog does not exist"));

		return blogMapper.toDTO(blogDocument);
	}

	@Override
	public BlogDTO findByIdWatch(String blogId) {
		BlogDocument blogDocument = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("Blog does not exist"));

		if (!BlogStatus.PUBLISHED.equals(blogDocument.getStatus())) {
			return null;
		}

		return blogMapper.toDTO(blogDocument);
	}

	@Override
	public BlogDTO approveBlog(String blogId) {
		BlogDocument blogDocument = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("Blog does not exist"));

		blogDocument.setStatus(BlogStatus.PUBLISHED);

		BlogDocument blogSaved = blogRepository.save(blogDocument);
		return blogMapper.toDTO(blogSaved);
	}

	@Override
	public BlogDTO createBlog(BlogDTO blogDTO, String email, String role) {

		if (blogDTO.getId() != null && !blogDTO.getId().isBlank()) {
			throw new IllegalArgumentException("ID must not be provided when creating a new blog post!");
		}

		categoryRepository.findById(blogDTO.getCategoryId())
				.orElseThrow(() -> new IllegalArgumentException("Category does not exist"));

		if (blogRepository.existsByAuthorEmailAndTitle(email, blogDTO.getTitle())) {
			throw new IllegalArgumentException("You have already posted a blog with the same title");
		}

		if (blogRepository.existsByAuthorEmailAndContent(email, blogDTO.getContent())) {
			throw new IllegalArgumentException("You have already posted a blog with the same content");
		}

		if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
			blogDTO.setStatus(BlogStatus.PUBLISHED);// auto publish for admin
		} else {
			if (BlogStatus.PUBLISHED.equals(blogDTO.getStatus())) {
				throw new IllegalArgumentException("You don't have permission to publish a blog post directly!");
			}

			if (blogDTO.getStatus() == null) {
				blogDTO.setStatus(BlogStatus.DRAFT);
			}
		}

		blogDTO.setCreatedAt(LocalDateTime.now());
		blogDTO.setAuthorEmail(email);

		BlogDocument documentToSave = blogMapper.toDocument(blogDTO);
		BlogDocument savedDocument = blogRepository.save(documentToSave);

		return blogMapper.toDTO(savedDocument);
	}

	@Override
	public BlogDTO updateBlog(BlogDTO blogDTO, String email, String role) {
		if (blogDTO.getId() == null || blogDTO.getId().isBlank()) {
			throw new IllegalArgumentException("Blog ID is required for update!");
		}

		BlogDocument existingBlog = blogRepository.findById(blogDTO.getId())
				.orElseThrow(() -> new IllegalArgumentException("Blog does not exist"));

		boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(role);
		if (!isAdmin && !existingBlog.getAuthorEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("You don't have permission to update this blog post!");
		}

		categoryRepository.findById(blogDTO.getCategoryId())
				.orElseThrow(() -> new IllegalArgumentException("Category does not exist"));

		if (isAdmin) {
			if (blogDTO.getStatus() != null) {
				existingBlog.setStatus(blogDTO.getStatus());
			}
		} else {
			// set to Draft wait admin approve
			blogDTO.setStatus(BlogStatus.DRAFT);
			existingBlog.setStatus(blogDTO.getStatus());
		}

		existingBlog.setTitle(blogDTO.getTitle());
		existingBlog.setContent(blogDTO.getContent());
		existingBlog.setThumbnailUrl(blogDTO.getThumbnailUrl());
		existingBlog.setCategoryId(blogDTO.getCategoryId());
		existingBlog.setTags(blogDTO.getTags());

		BlogDocument savedDocument = blogRepository.save(existingBlog);
		return blogMapper.toDTO(savedDocument);
	}

	@Override
	public void deleteBlog(String blogId, String email, String role) {
		BlogDocument blog = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("The blog does not exist !"));

		if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !blog.getAuthorEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("The blog isn't created by user with email: " + email);
		}
		blogRepository.delete(blog);
	}

	@Override
	public BlogPostedResponse findBlogsPosted(String recruiterEmail, String searchQuery, String category, String status,
			Pageable pageable) {
		boolean hasSearch = StringUtils.hasText(searchQuery);
		boolean hasCategory = category != null && !category.isBlank() && !"All".equalsIgnoreCase(category);
		boolean hasStatus = status != null && !status.isBlank() && !"All".equalsIgnoreCase(status);

		Query query = new Query();
		List<Criteria> criterias = new ArrayList<Criteria>();

		if (hasSearch) {
			String keyworld = searchQuery.trim();

			criterias.add(Criteria.where("title").regex(keyworld, "i"));
		}

		if (hasCategory) {
			criterias.add(Criteria.where("categoryId").is(category));
		}

		if (hasStatus) {
			criterias.add(Criteria.where("status").is(status));
		}

		criterias.add(Criteria.where("authorEmail").is(recruiterEmail));

		if (!criterias.isEmpty()) {
			query.addCriteria(new Criteria().andOperator(criterias.toArray(new Criteria[0])));
		}

		long total = mongoTemplate.count(query, BlogDocument.class);

		query.with(pageable);

		List<BlogDocument> blogDocuments = mongoTemplate.find(query, BlogDocument.class);

		boolean hasNext = (pageable.getOffset() + blogDocuments.size()) < total;

		List<BlogDTO> blogDTOs = blogDocuments.stream().map(blogMapper::toDTO).toList();

		Slice<BlogDTO> blogSlice = new SliceImpl<>(blogDTOs, pageable, hasNext);

		BlogPostedResponse response = new BlogPostedResponse();
		response.setBlogSlice(blogSlice);
		response.setTotalElement((int) total);

		return response;
	}

}
