package com.loihvk23.profile_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.profile_service.document.RecruiterProfileDocument;
import com.loihvk23.profile_service.dto.RecruiterProfileDTO;

@Mapper(componentModel = "spring")
public interface RecruiterProfileMapper {

	public RecruiterProfileDTO toDTO(RecruiterProfileDocument recruiterProfileDocument);

	public RecruiterProfileDocument toDocument(RecruiterProfileDTO recruiterProfileDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "emailRecruiter", ignore = true)
	void updateDocumentFromDTO(RecruiterProfileDTO dto, @MappingTarget RecruiterProfileDocument document);

}
