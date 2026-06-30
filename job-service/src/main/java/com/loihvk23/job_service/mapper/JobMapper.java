package com.loihvk23.job_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.dto.JobDTO;

@Mapper(componentModel = "spring")
public interface JobMapper {

	public JobDTO toDTO(JobDocument jobDocument);

	public JobDocument toDocument(JobDTO jobDTO);
}
