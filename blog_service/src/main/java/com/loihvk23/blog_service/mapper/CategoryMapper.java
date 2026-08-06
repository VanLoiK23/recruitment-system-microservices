package com.loihvk23.blog_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.blog_service.document.CategoryDocument;
import com.loihvk23.blog_service.dto.CategoryDTO;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
	CategoryDTO toDTO(CategoryDocument categoryDocument);
	
	CategoryDocument toDocument(CategoryDTO categoryDTO);
}
