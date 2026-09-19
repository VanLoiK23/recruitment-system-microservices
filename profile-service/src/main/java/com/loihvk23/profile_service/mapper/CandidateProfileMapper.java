package com.loihvk23.profile_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.loihvk23.profile_service.document.CandidateProfileDocument;
import com.loihvk23.profile_service.dto.CandidateProfileDTO;

@Mapper(componentModel = "spring")
public interface CandidateProfileMapper {

	public CandidateProfileDTO toDTO(CandidateProfileDocument candidateProfileDocument);

	public CandidateProfileDocument toDocument(CandidateProfileDTO candidateProfileDTO);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "emailCandidate", ignore = true)
	void updateDocumentFromDTO(CandidateProfileDTO dto, @MappingTarget CandidateProfileDocument document);

}
