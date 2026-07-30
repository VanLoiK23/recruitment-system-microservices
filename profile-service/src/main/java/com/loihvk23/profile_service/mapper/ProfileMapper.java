package com.loihvk23.profile_service.mapper;

import org.mapstruct.MapMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.profile_service.document.ProfileDocument;
import com.loihvk23.profile_service.dto.ProfileDTO;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

	public ProfileDTO toDTO(ProfileDocument profileDocument);

	public ProfileDocument toDocument(ProfileDTO profileDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "emailCandidate", ignore = true)
	void updateDocumentFromDTO(ProfileDTO dto, @MappingTarget ProfileDocument document);

}
