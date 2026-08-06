package com.loihvk23.blog_service.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.blog_service.document.BlogDocument;
import com.loihvk23.blog_service.document.CategoryDocument;
import com.loihvk23.blog_service.dto.BlogDTO;
import com.loihvk23.blog_service.mapper.BlogMapper;
import com.loihvk23.blog_service.repository.BlogRepository;
import com.loihvk23.blog_service.repository.CategoryRepository;
import com.loihvk23.blog_service.service.BlogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
	private final BlogRepository blogRepository;

	private final BlogMapper blogMapper;

	private final CategoryRepository categoryRepository;

	@Override
	public Slice<BlogDTO> getBlogsSlice(Pageable pageable) {

		Slice<BlogDocument> blogsDocument = blogRepository.findAllBy(pageable);

		Slice<BlogDTO> blogs = blogsDocument.map(blogMapper::toDTO);

		return blogs;
	}

	@Override
	public Slice<BlogDTO> findBlogsByCategory(String category, Pageable pageable) {
		List<CategoryDocument> categoryDocuments = categoryRepository.findByName(category);

		if (categoryDocuments == null || categoryDocuments.isEmpty()) {
			throw new IllegalArgumentException("The category isn't exist");
		}
		Slice<BlogDocument> blogsDocument = blogRepository.findByCategoryId(categoryDocuments.get(0).getId(), pageable);

		Slice<BlogDTO> blogs = blogsDocument.map(blogMapper::toDTO);
		return blogs;
	}

	@Override
	public BlogDTO saveBlog(String email, BlogDTO blogDTO) {
		blogDTO.setAuthorEmail(email);

		return blogMapper.toDTO(blogRepository.save(blogMapper.toDocument(blogDTO)));
	}

	@Override
	public void deleteBlog(String email, String blogId) {
		BlogDocument blog = blogRepository.findById(blogId)
				.orElseThrow(() -> new IllegalArgumentException("The blog isn't exist !"));

		if (!blog.getAuthorEmail().equalsIgnoreCase(email)) {
			throw new IllegalArgumentException("The blog isn't created by user with email: " + email);
		}
		blogRepository.delete(blog);
	}

}
