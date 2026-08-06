package com.loihvk23.blog_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.blog_service.document.BlogDocument;
import com.loihvk23.blog_service.dto.BlogDTO;

@Mapper(componentModel = "spring")
public interface BlogMapper {
	BlogDTO toDTO(BlogDocument blogDocument);
	
	BlogDocument toDocument(BlogDTO blogDTO);
}
