package com.loihvk23.profile_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.profile_service.document.CompanyMemberDocument;
import com.loihvk23.profile_service.dto.CompanyMemberDTO;

@Mapper(componentModel = "spring")
public interface CompanyMemberMapper {

	public CompanyMemberDTO toDTO(CompanyMemberDocument companyMemberDocument);

	public CompanyMemberDocument toDocument(CompanyMemberDTO companyMemberDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "companyId", ignore = true)
	@Mapping(target = "recruiterEmail", ignore = true)
	@Mapping(target = "role", ignore = true)
	void updateDocumentFromDTO(CompanyMemberDTO dto, @MappingTarget CompanyMemberDocument document);

}
