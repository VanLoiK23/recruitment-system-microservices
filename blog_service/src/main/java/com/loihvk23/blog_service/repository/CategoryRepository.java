package com.loihvk23.blog_service.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.loihvk23.blog_service.document.CategoryDocument;


public interface CategoryRepository extends MongoRepository<CategoryDocument, String>{
	List<CategoryDocument> findByName(String name);
	
	Slice<CategoryDocument> findAllBy(Pageable pageable);
}
