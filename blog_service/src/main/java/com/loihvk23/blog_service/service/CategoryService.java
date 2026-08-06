package com.loihvk23.blog_service.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.blog_service.dto.CategoryDTO;

public interface CategoryService {
	Slice<CategoryDTO> getCategoriesSlice(Pageable pageable);

	List<CategoryDTO> getCategories();

	CategoryDTO saveCategory(CategoryDTO categoryDTO);
}
