package com.loihvk23.application_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.application_service.dto.ApplicationDTO;
import com.loihvk23.application_service.entity.ApplicationEntity;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
	ApplicationDTO toDTO(ApplicationEntity applicationEntity);

	ApplicationEntity toEntity(ApplicationDTO applicationDTO);
}
