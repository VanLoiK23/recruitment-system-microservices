package com.loihvk23.profile_service.service.impl;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.profile_service.document.CandidateProfileDocument;
import com.loihvk23.profile_service.document.RecruiterProfileDocument;
import com.loihvk23.profile_service.dto.CandidateProfileDTO;
import com.loihvk23.profile_service.dto.RecruiterProfileDTO;
import com.loihvk23.profile_service.mapper.CandidateProfileMapper;
import com.loihvk23.profile_service.mapper.RecruiterProfileMapper;
import com.loihvk23.profile_service.repository.CandidateProfileRepository;
import com.loihvk23.profile_service.repository.RecruiterProfileRepository;
import com.loihvk23.profile_service.service.FileStorageService;
import com.loihvk23.profile_service.service.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

	private final CandidateProfileRepository candidateProfileRepository;

	private final CandidateProfileMapper candidateProfileMapper;

	private final RecruiterProfileRepository recruiterProfileRepository;

	private final RecruiterProfileMapper recruiterProfileMapper;

	private final FileStorageService fileStorageService;

	@Override
	public CandidateProfileDTO saveCandidateProfile(CandidateProfileDTO candidateProfileDTO, String emailCandidate) {
		Optional<CandidateProfileDocument> existingOpt = candidateProfileRepository
				.findByEmailCandidate(emailCandidate);

		// prevent duplicate profile
		CandidateProfileDocument documentToSave;

		if (existingOpt.isPresent()) {
			documentToSave = existingOpt.get();

			candidateProfileMapper.updateDocumentFromDTO(candidateProfileDTO, documentToSave);

		} else {
			documentToSave = candidateProfileMapper.toDocument(candidateProfileDTO);
			documentToSave.setEmailCandidate(emailCandidate);
		}

		return candidateProfileMapper.toDTO(candidateProfileRepository.save(documentToSave));
	}

	@Override
	public CandidateProfileDTO findCandidateProfileByEmail(String emailCandidate) {
		Optional<CandidateProfileDocument> candidateProfileDocument = candidateProfileRepository
				.findByEmailCandidate(emailCandidate);

		if (candidateProfileDocument.isPresent()) {
			CandidateProfileDTO candidateProfileDTO = candidateProfileMapper.toDTO(candidateProfileDocument.get());

			return candidateProfileDTO;
		}

		return null;
	}

	@Override
	public RecruiterProfileDTO saveRecruiterProfile(RecruiterProfileDTO recruiterProfileDTO, String emailRecruiter) {
		Optional<RecruiterProfileDocument> existingOpt = recruiterProfileRepository
				.findByEmailRecruiter(emailRecruiter);

		// prevent duplicate profile
		RecruiterProfileDocument documentToSave;

		if (existingOpt.isPresent()) {
			documentToSave = existingOpt.get();

			recruiterProfileMapper.updateDocumentFromDTO(recruiterProfileDTO, documentToSave);

		} else {
			documentToSave = recruiterProfileMapper.toDocument(recruiterProfileDTO);
			documentToSave.setEmailRecruiter(emailRecruiter);
		}

		return recruiterProfileMapper.toDTO(recruiterProfileRepository.save(documentToSave));
	}

	@Override
	public RecruiterProfileDTO findRecruiterProfileByEmail(String emailRecruiter) {
		Optional<RecruiterProfileDocument> recruiterProfileDocument = recruiterProfileRepository
				.findByEmailRecruiter(emailRecruiter);

		if (recruiterProfileDocument.isPresent()) {
			RecruiterProfileDTO recruiterProfileDTO = recruiterProfileMapper.toDTO(recruiterProfileDocument.get());

			return recruiterProfileDTO;
		}

		return null;
	}

	@Override
	@Transactional
	public String uploadAvatar(MultipartFile file, String email, String role) throws IOException {
		if (role == null || role.isBlank()) {
			throw new IllegalArgumentException("Unauthorization!!");
		}

		String avatar = fileStorageService.uploadAvatar(file);

		if ("ROLE_CANDIDATE".equals(role)) {
			CandidateProfileDocument candidateProfile = candidateProfileRepository.findByEmailCandidate(email)
					.orElse(null);
			if (candidateProfile == null) {
				fileStorageService.deleteAvatar(avatar); // roll back
				throw new IllegalArgumentException("Profile doesn't found !!");
			}
			deleteOldAvatar(candidateProfile.getAvatar());
			candidateProfile.setAvatar(avatar);
			candidateProfileRepository.save(candidateProfile);
		} else if ("ROLE_RECRUITER".equals(role)) {
			RecruiterProfileDocument recruiterProfile = recruiterProfileRepository.findByEmailRecruiter(email)
					.orElse(null);
			if (recruiterProfile == null) {
				fileStorageService.deleteAvatar(avatar);
				throw new IllegalArgumentException("Profile doesn't found !!");
			}
			deleteOldAvatar(recruiterProfile.getAvatar());
			recruiterProfile.setAvatar(avatar);
			recruiterProfileRepository.save(recruiterProfile);
		}

		return avatar;
	}

	private void deleteOldAvatar(String old) throws IOException {
		if (old == null || old.isBlank()) {
			return;
		}
		fileStorageService.deleteAvatar(old);
	}
}
