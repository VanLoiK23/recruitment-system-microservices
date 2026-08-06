package com.loihvk23.blog_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.blog_service.document.CategoryDocument;
import com.loihvk23.blog_service.dto.CategoryDTO;
import com.loihvk23.blog_service.mapper.CategoryMapper;
import com.loihvk23.blog_service.repository.CategoryRepository;
import com.loihvk23.blog_service.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
	private final CategoryRepository categoryRepository;

	private final CategoryMapper categoryMapper;

	@Override
	public Slice<CategoryDTO> getCategoriesSlice(Pageable pageable) {
		Slice<CategoryDocument> categoriesDocument = categoryRepository.findAllBy(pageable);

		Slice<CategoryDTO> categories = categoriesDocument.map(categoryMapper::toDTO);

		return categories;
	}

	@Override
	public List<CategoryDTO> getCategories() {
		List<CategoryDocument> categoriesDocument = categoryRepository.findAll();

		List<CategoryDTO> categories = categoriesDocument.stream().map(categoryMapper::toDTO)
				.collect(Collectors.toList());

		return categories;
	}

	@Override
	public CategoryDTO saveCategory(CategoryDTO categoryDTO) {		
		return categoryMapper.toDTO(categoryRepository.save(categoryMapper.toDocument(categoryDTO)));
	}

}
