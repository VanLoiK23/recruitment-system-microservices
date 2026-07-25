package com.loihvk23.application_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.application_service.dto.CvDTO;
import com.loihvk23.application_service.entity.CvEntity;

@Mapper(componentModel = "spring")
public interface CvMapper {
	CvDTO toDTO(CvEntity cvEntity);

	CvEntity toEntity(CvDTO cvDTO);
}
