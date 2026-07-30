package com.loihvk23.profile_service.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.loihvk23.profile_service.document.ProfileDocument;
import com.loihvk23.profile_service.dto.ProfileDTO;
import com.loihvk23.profile_service.mapper.ProfileMapper;
import com.loihvk23.profile_service.repository.ProfileRepository;
import com.loihvk23.profile_service.service.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

	private final ProfileRepository profileRepository;

	private final ProfileMapper profileMapper;

	@Override
	public ProfileDTO saveProfile(ProfileDTO profileDTO,String emailCandidate) {
		Optional<ProfileDocument> existingOpt = profileRepository.findByEmailCandidate(emailCandidate);

		//prevent duplicate profile
		ProfileDocument documentToSave;

	    if (existingOpt.isPresent()) {
	        documentToSave = existingOpt.get();
	        
	        profileMapper.updateDocumentFromDTO(profileDTO, documentToSave);
	        
	    } else {
	        documentToSave = profileMapper.toDocument(profileDTO);
	        documentToSave.setEmailCandidate(emailCandidate);
	    }

		return profileMapper.toDTO(profileRepository.save(documentToSave));
	}

	@Override
	public ProfileDTO findProfileByEmail(String emailCandidate) {
		Optional<ProfileDocument> profileDocument = profileRepository.findByEmailCandidate(emailCandidate);

		if (profileDocument.isPresent()) {
			ProfileDTO profileDTO = profileMapper.toDTO(profileDocument.get());

			return profileDTO;
		}

		return null;
	}

}
