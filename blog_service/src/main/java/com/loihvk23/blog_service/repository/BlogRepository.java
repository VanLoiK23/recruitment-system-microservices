package com.loihvk23.blog_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.blog_service.document.BlogDocument;

public interface BlogRepository extends MongoRepository<BlogDocument, String> {
	Slice<BlogDocument> findByTagsContaining(String tags, Pageable pageable);
	
	Slice<BlogDocument> findByTitleContainingIgnoreCaseAndCategoryIdAndStatus(String title, String categoryId, String status, Pageable pageable);

    Slice<BlogDocument> findByTitleContainingIgnoreCaseAndStatus(String title, String status, Pageable pageable);

    Slice<BlogDocument> findByCategoryIdAndStatus(String categoryId, String status, Pageable pageable);	
    
	Slice<BlogDocument> findByTagsInAndStatus(List<String> tags, String status, Pageable pageable);

	Slice<BlogDocument> findAllBy(Pageable pageable);
	
	List<BlogDocument> findByAuthorEmail(String authorEmail);
	
	boolean existsByAuthorEmailAndTitle(String authorEmail, String title);
	
	boolean existsByAuthorEmailAndContent(String authorEmail, String content);
}
