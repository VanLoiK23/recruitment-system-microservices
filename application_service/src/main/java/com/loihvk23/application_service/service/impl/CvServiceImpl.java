package com.loihvk23.application_service.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.loihvk23.application_service.dto.CvDTO;
import com.loihvk23.application_service.entity.CvEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.mapper.CvMapper;
import com.loihvk23.application_service.repository.CvRepository;
import com.loihvk23.application_service.service.CvService;
import com.loihvk23.application_service.service.FileStorageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CvServiceImpl implements CvService {
	private final CvRepository cvRepository;
	private final CvMapper mapper;
	private final FileStorageService fileStorageService;

	private String calculateHash(MultipartFile file) {
		try {
			return DigestUtils.sha256Hex(file.getInputStream());
		} catch (IOException e) {
			throw new RuntimeException("Error to read file", e);
		}
	}

	@Override
	@Transactional
	public CvDTO uploadCv(MultipartFile file, String emailCandidate) throws IOException {
		List<CvEntity> cvEntities = cvRepository.findByCandidateEmail(emailCandidate);

		if (cvEntities != null && !cvEntities.isEmpty()) {
			boolean isDuplicateName = cvEntities.stream()
					.anyMatch(cv -> file.getOriginalFilename().equalsIgnoreCase(cv.getFileName()));

			if (isDuplicateName) {
				throw new IllegalArgumentException("File CV name has already exist!");
			}

			String newFileHash = calculateHash(file);

			boolean isDuplicateContent = cvEntities.stream().anyMatch(cv -> newFileHash.equals(cv.getFileHash()));

			if (isDuplicateContent) {
				throw new IllegalArgumentException("File CV content has already exist!");
			}
		}

		LocalDateTime dateTime = LocalDateTime.now();
		String urlCv = fileStorageService.uploadCV(file);
		String fileHash = calculateHash(file);

		if (urlCv == null || urlCv.isEmpty()) {
			throw new IllegalArgumentException("Upload file CV failed. Try again !!");
		}
		CvDTO cvDTO = CvDTO.builder().candidateEmail(emailCandidate).fileName(file.getOriginalFilename())
				.uploadedAt(dateTime).fileUrl(urlCv).fileHash(fileHash).build();

		CvEntity cvEntity = cvRepository.save(mapper.toEntity(cvDTO));
		return mapper.toDTO(cvEntity);
	}

	@Override
	public List<CvDTO> getAllCvByCandidate(String candidateEmail) {
		List<CvEntity> cvEntities = cvRepository.findByCandidateEmail(candidateEmail);
		List<CvDTO> cvdtos = cvEntities.stream().map(mapper::toDTO).collect(Collectors.toList());
		return cvdtos;
	}

	@Override
	public Slice<CvDTO> getCvsFollowPage(String candidateEmail, Pageable pageable) {
		Slice<CvEntity> cvEntities = cvRepository.findByCandidateEmail(candidateEmail, pageable);
		Slice<CvDTO> cvdtos = cvEntities.map(mapper::toDTO);
		return cvdtos;
	}

	@Override
	public void deleteCv(String cvId, String emailCandidate) throws IOException {
		CvEntity cvEntity = cvRepository.findById(cvId)
				.orElseThrow(() -> new ResourceNotFoundException("Cv isn't exist !"));

		if (!cvEntity.getCandidateEmail().equalsIgnoreCase(emailCandidate)) {
			throw new IllegalArgumentException("You can't delete this CV. (Not authorization)");
		}
		fileStorageService.deleteFile(cvEntity.getFileUrl());

		cvRepository.delete(cvEntity);
	}

}
