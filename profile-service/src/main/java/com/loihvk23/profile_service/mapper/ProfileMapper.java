package com.loihvk23.profile_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.profile_service.document.ProfileDocument;
import com.loihvk23.profile_service.dto.ProfileDTO;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

	public ProfileDTO toDTO(ProfileDocument profileDocument);

	public ProfileDocument toDocument(ProfileDTO profileDTO);
}
