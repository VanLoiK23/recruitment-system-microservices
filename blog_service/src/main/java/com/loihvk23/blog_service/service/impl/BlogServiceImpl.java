package com.loihvk23.blog_service.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.blog_service.BlogStatus;
import com.loihvk23.blog_service.document.BlogDocument;
import com.loihvk23.blog_service.document.CategoryDocument;
import com.loihvk23.blog_service.dto.BlogDTO;
import com.loihvk23.blog_service.dto.response.BlogPostedResponse;
import com.loihvk23.blog_service.mapper.BlogMapper;
import com.loihvk23.blog_service.repository.BlogRepository;
import com.loihvk23.blog_service.repository.CategoryRepository;
import com.loihvk23.blog_service.service.BlogService;
import com.loihvk23.blog_service.service.CloudinaryService;

import io.jsonwebtoken.lang.Arrays;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
	private final BlogRepository blogRepository;

	private final BlogMapper blogMapper;

	private final CategoryRepository categoryRepository;

	private final MongoTemplate mongoTemplate;

	private final CloudinaryService cloudinaryService;

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
	public BlogDTO updateStatusByAdmin(String blogId, BlogStatus status) {
		BlogDocument blogDocument = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("Blog does not exist"));

		blogDocument.setStatus(status);

		BlogDocument blogSaved = blogRepository.save(blogDocument);
		return blogMapper.toDTO(blogSaved);
	}

	@Override
	public BlogDTO saveBlogDraft(BlogDTO blogDTO, MultipartFile thumbnailFile, String email) throws IOException {
		BlogDocument blog = blogRepository.findByAuthorEmailAndStatus(email, "DRAFT").orElse(null);
		String oldUrl = (blog != null) ? blog.getThumbnailUrl() : "";

		if (blog != null) {
			blogDTO.setId(blog.getId());
		}

		if (blogDTO.getId() == null || blogDTO.getId().isBlank()) {
			blogDTO.setId(null);
		}

		String urlImg = (thumbnailFile != null && !thumbnailFile.isEmpty()) ? cloudinaryService.uploadImg(thumbnailFile)
				: oldUrl;

		if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
			deleteFileImgInBlogDraf(email);
		}

		if (!urlImg.isBlank()) {
			blogDTO.setThumbnailUrl(urlImg);
		}
		blogDTO.setAuthorEmail(email);
		blogDTO.setStatus(BlogStatus.DRAFT);
		BlogDocument blogDocumentSaved = blogRepository.save(blogMapper.toDocument(blogDTO));

		return blogMapper.toDTO(blogDocumentSaved);
	}

	@Override
	public BlogDTO fetchBlogDraft(String email) {
		BlogDocument blogDocument = blogRepository.findByAuthorEmailAndStatus(email, "DRAFT").orElse(null);

		return blogMapper.toDTO(blogDocument);
	}

	private void deleteFileImgInBlogDraf(String email) throws IOException {
		BlogDocument blog = blogRepository.findByAuthorEmailAndStatus(email, "DRAFT").orElse(null);

		if (blog != null && blog.getThumbnailUrl() != null && !blog.getThumbnailUrl().isBlank()) {
			cloudinaryService.deleteFile(blog.getThumbnailUrl());
		}
	}

	@Override
	public BlogDTO createBlog(BlogDTO blogDTO, MultipartFile thumbnailFile, String email, String role)
			throws IOException {
		String statusDraft = "DRAFT";
		BlogDocument blog = blogRepository.findByAuthorEmailAndStatus(email, statusDraft).orElse(null);

		if (blogDTO.getId() != null && !blogDTO.getId().isBlank() && blog == null) {
			throw new IllegalArgumentException("ID must not be provided when creating a new blog post!");
		}

		if (blog != null) {
			blogDTO.setId(blog.getId());
		}

		if (blogDTO.getId() == null || blogDTO.getId().isBlank()) {
			blogDTO.setId(null);
		}
		
		categoryRepository.findById(blogDTO.getCategoryId())
				.orElseThrow(() -> new IllegalArgumentException("Category does not exist"));

		if (blogRepository.existsByAuthorEmailAndTitleAndStatusIsNot(email, blogDTO.getTitle(), statusDraft)) {
			throw new IllegalArgumentException("You have already posted a blog with the same title");
		}

		if (blogRepository.existsByAuthorEmailAndContentAndStatusIsNot(email, blogDTO.getContent(), statusDraft)) {
			throw new IllegalArgumentException("You have already posted a blog with the same content");
		}

		if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
			blogDTO.setStatus(BlogStatus.PUBLISHED);// auto publish for admin
		} else {
			if (BlogStatus.PUBLISHED.equals(blogDTO.getStatus())) {
				throw new IllegalArgumentException("You don't have permission to publish a blog post directly!");
			}

			blogDTO.setStatus(BlogStatus.PENDING);
		}

		if (thumbnailFile == null || thumbnailFile.isEmpty()) {
			if (blog != null && blog.getThumbnailUrl() != null && !blog.getThumbnailUrl().isBlank()) {
				blogDTO.setThumbnailUrl(blog.getThumbnailUrl());
			} else {
				throw new IllegalArgumentException("Thumbnail img is required !");
			}
		} else {
			String urlImg = cloudinaryService.uploadImg(thumbnailFile);

			blogDTO.setThumbnailUrl(urlImg);

			deleteFileImgInBlogDraf(email);
		}

		blogDTO.setViewCount(0L);
		blogDTO.setCreatedAt(LocalDateTime.now());
		blogDTO.setAuthorEmail(email);

		BlogDocument documentToSave = blogMapper.toDocument(blogDTO);
		BlogDocument savedDocument = blogRepository.save(documentToSave);

		return blogMapper.toDTO(savedDocument);
	}

	@Override
	public BlogDTO updateBlog(String blogId, BlogDTO blogDTO, MultipartFile thumbnailFile, String email, String role)
			throws IOException {
		blogDTO.setId(blogId);
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
			// set to Pending wait admin approve
			blogDTO.setStatus(BlogStatus.PENDING);
			existingBlog.setStatus(blogDTO.getStatus());
		}

		if ((thumbnailFile == null || thumbnailFile.isEmpty())
				&& (existingBlog.getThumbnailUrl() == null || existingBlog.getThumbnailUrl().isBlank())) {
			throw new IllegalArgumentException("Thumbnail img is required !");
		}

		if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
			String urlImg = cloudinaryService.uploadImg(thumbnailFile);

			if (!urlImg.isBlank()) {
				cloudinaryService.deleteFile(existingBlog.getThumbnailUrl());
				blogDTO.setThumbnailUrl(urlImg);
			}
		} else {
			blogDTO.setThumbnailUrl(existingBlog.getThumbnailUrl());
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
	public void deleteBlog(String blogId, String email, String role) throws IOException {
		BlogDocument blog = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("The blog does not exist !"));

		if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !blog.getAuthorEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("The blog isn't created by user with email: " + email);
		}
		cloudinaryService.deleteFile(blog.getThumbnailUrl());
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
			String keyword = searchQuery.trim();

			List<CategoryDocument> matchesCategories = categoryRepository.findByNameContainingIgnoreCase(keyword);

			List<String> matchesCategoryIds = matchesCategories.stream().map(CategoryDocument::getId)
					.collect(Collectors.toList());

			List<Criteria> orConditions = new ArrayList<Criteria>();

			orConditions.add(Criteria.where("title").regex(keyword, "i"));
			orConditions.add(Criteria.where("tags").regex(keyword, "i"));

			if (matchesCategoryIds != null && !matchesCategoryIds.isEmpty()) {
				orConditions.add(Criteria.where("categoryId").in(matchesCategoryIds));
			}

			Criteria searchCriteria = new Criteria().orOperator(orConditions.toArray(new Criteria[0]));
			criterias.add(searchCriteria);
		}

		if (hasCategory) {
			criterias.add(Criteria.where("categoryId").is(category));
		}

		if (hasStatus) {
			criterias.add(Criteria.where("status").is(status));
		} else {
			criterias.add(Criteria.where("status").ne("DRAFT"));
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

		List<String> categoriesId = blogDTOs.stream().map(BlogDTO::getCategoryId).collect(Collectors.toList());
		Iterable<CategoryDocument> categories = categoryRepository.findAllById(categoriesId);
		Map<String, String> categoryMap = new HashMap<String, String>();

		categories.forEach(item -> {
			categoryMap.put(item.getId(), item.getName());
		});

		List<BlogDTO> adjustBlogDTOs = blogDTOs.stream().map(blog -> {
			blog.setCategory(categoryMap.get(blog.getCategoryId()));
			return blog;
		}).collect(Collectors.toList());

		Slice<BlogDTO> blogSlice = new SliceImpl<>(adjustBlogDTOs, pageable, hasNext);

		BlogPostedResponse response = new BlogPostedResponse();
		response.setBlogSlice(blogSlice);
		response.setTotalElement((int) total);

		return response;
	}

}
