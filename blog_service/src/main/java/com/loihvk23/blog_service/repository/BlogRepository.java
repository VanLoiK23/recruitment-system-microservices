package com.loihvk23.blog_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.blog_service.BlogStatus;
import com.loihvk23.blog_service.document.BlogDocument;

public interface BlogRepository extends MongoRepository<BlogDocument, String> {
	Slice<BlogDocument> findByTagsContaining(String tags, Pageable pageable);

	Slice<BlogDocument> findByTitleContainingIgnoreCaseAndCategoryIdAndStatus(String title, String categoryId,
			String status, Pageable pageable);

	Slice<BlogDocument> findByTitleContainingIgnoreCaseAndStatus(String title, String status, Pageable pageable);

	Slice<BlogDocument> findByCategoryIdAndStatus(String categoryId, String status, Pageable pageable);

	Slice<BlogDocument> findByTagsInAndStatus(List<String> tags, String status, Pageable pageable);

	Slice<BlogDocument> findAllBy(Pageable pageable);

	List<BlogDocument> findByAuthorEmail(String authorEmail);

	Slice<BlogDocument> findByAuthorEmailAndTitleContainingIgnoreCaseAndCategoryIdAndStatus(String authorEmail,
			String title, String categoryId, String status, Pageable pageable);

	Slice<BlogDocument> findByAuthorEmailAndTitleContainingIgnoreCase(String authorEmail, String title,
			Pageable pageable);

	Slice<BlogDocument> findByAuthorEmailAndCategoryIdAndStatus(String authorEmail, String title, String categoryId,
			String status, Pageable pageable);

	Optional<BlogDocument> findByAuthorEmailAndStatus(String authorEmail, String status);

	boolean existsByAuthorEmailAndTitleAndStatusIsNot(String authorEmail, String title, String status);

	boolean existsByAuthorEmailAndContentAndStatusIsNot(String authorEmail, String content, String status);
}
