package com.loihvk23.job_service.mapper;

import org.mapstruct.Mapper;

import com.loihvk23.job_service.document.SavedJobDocument;
import com.loihvk23.job_service.dto.SavedJobDTO;

@Mapper(componentModel = "spring")
public interface SavedJobMapper {

	public SavedJobDTO toDTO(SavedJobDocument savedJobDocument);

	public SavedJobDocument toDocument(SavedJobDTO savedJobDTO);
}
