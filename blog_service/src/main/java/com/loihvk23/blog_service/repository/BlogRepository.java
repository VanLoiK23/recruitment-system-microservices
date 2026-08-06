package com.loihvk23.blog_service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.blog_service.document.BlogDocument;

public interface BlogRepository extends MongoRepository<BlogDocument, String> {
	Slice<BlogDocument> findByTagsContaining(String tags, Pageable pageable);

	Slice<BlogDocument> findByCategoryId(String categoryId, Pageable pageable);

	Slice<BlogDocument> findAllBy(Pageable pageable);
}
