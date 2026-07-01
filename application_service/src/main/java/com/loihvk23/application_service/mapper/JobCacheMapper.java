package com.loihvk23.application_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.application_service.dto.JobCacheDTO;
import com.loihvk23.application_service.entity.JobCacheEntity;

@Mapper(componentModel = "spring")
public interface JobCacheMapper {
	JobCacheDTO toDTO(JobCacheEntity jobCacheEntity);

	JobCacheEntity toEntity(JobCacheDTO jobCacheDTO);
}
