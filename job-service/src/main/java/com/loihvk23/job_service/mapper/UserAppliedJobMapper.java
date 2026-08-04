package com.loihvk23.job_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.job_service.document.UserAppliedJobDocument;
import com.loihvk23.job_service.dto.UserAppliedJobDTO;

@Mapper(componentModel = "spring")
public interface UserAppliedJobMapper {

	public UserAppliedJobDTO toDTO(UserAppliedJobDocument userAppliedJobDocument);

	public UserAppliedJobDocument toDocument(UserAppliedJobDTO userAppliedJobDTO);
}
