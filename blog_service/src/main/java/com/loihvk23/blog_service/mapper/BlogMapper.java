package com.loihvk23.blog_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.blog_service.document.BlogDocument;
import com.loihvk23.blog_service.dto.BlogDTO;

@Mapper(componentModel = "spring")
public interface BlogMapper {
//	@Mapping(source = "category.id", target = "categoryId")
	BlogDTO toDTO(BlogDocument blogDocument);

//	@Mapping(target = "category", source = "categoryId", qualifiedByName = "idToCategory")
	BlogDocument toDocument(BlogDTO blogDTO);

//	@Named("idToCategory")
//	default CategoryDocument idToCategory(String categoryId) {
//		if (categoryId == null || categoryId.isBlank()) {
//			return null;
//		}
//		CategoryDocument category = new CategoryDocument();
//		category.setId(categoryId);
//		return category;
//	}
}
