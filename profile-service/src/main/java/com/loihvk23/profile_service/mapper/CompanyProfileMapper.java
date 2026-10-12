package com.loihvk23.profile_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.profile_service.document.CompanyDocument;
import com.loihvk23.profile_service.dto.CompanyProfileDTO;

@Mapper(componentModel = "spring")
public interface CompanyProfileMapper {

	public CompanyProfileDTO toDTO(CompanyDocument companyDocument);

	public CompanyDocument toDocument(CompanyProfileDTO companyProfileDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "ownerEmail", ignore = true)
	void updateDocumentFromDTO(CompanyProfileDTO dto, @MappingTarget CompanyDocument document);

}
