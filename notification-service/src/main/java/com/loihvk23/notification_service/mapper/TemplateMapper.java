package com.loihvk23.notification_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.notification_service.document.TemplateDocument;
import com.loihvk23.notification_service.dto.TemplateDTO;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

	public TemplateDTO toDTO(TemplateDocument templateDocument);

	public TemplateDocument toDocument(TemplateDTO templateDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "ownerEmail", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	void updateDocumentFromDTO(TemplateDTO templateDTO, @MappingTarget TemplateDocument templateDocument);
}
