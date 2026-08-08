package com.loihvk23.blog_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.blog_service.document.BlogDocument;

public interface BlogRepository extends MongoRepository<BlogDocument, String> {
	Slice<BlogDocument> findByTagsContaining(String tags, Pageable pageable);
	
	Slice<BlogDocument> findByTitleContainingIgnoreCaseAndCategoryId(String title, String categoryId, Pageable pageable);

    Slice<BlogDocument> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Slice<BlogDocument> findByCategoryId(String categoryId, Pageable pageable);	
    
	Slice<BlogDocument> findByTagsIn(List<String> tags, Pageable pageable);

	Slice<BlogDocument> findAllBy(Pageable pageable);
	
	List<BlogDocument> findByAuthorEmail(String authorEmail);
	
	boolean existsByAuthorEmailAndTitle(String authorEmail, String title);
	
	boolean existsByAuthorEmailAndContent(String authorEmail, String content);
}
