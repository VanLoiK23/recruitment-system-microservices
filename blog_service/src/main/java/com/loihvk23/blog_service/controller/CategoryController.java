package com.loihvk23.blog_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loihvk23.blog_service.dto.CategoryDTO;
import com.loihvk23.blog_service.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("CategoryResController")
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
	private final CategoryService categoryService;

	@GetMapping
	public ResponseEntity<?> getCategories() {
		List<CategoryDTO> categories = categoryService.getCategories();

		return ResponseEntity.ok(categories);
	}

	@PostMapping
	public ResponseEntity<?> saveCategory(@RequestBody @Valid CategoryDTO categoryDTO) {
		CategoryDTO category = categoryService.saveCategory(categoryDTO);

		return ResponseEntity.ok(category);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable(name = "id") String categoryId) {
		categoryService.deleteCategory(categoryId);

		return ResponseEntity.ok(Map.of("isSuccess", true));
	}
}
