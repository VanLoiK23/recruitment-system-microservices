package com.loihvk23.application_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.application_service.dto.CvDTO;
import com.loihvk23.application_service.entity.CvEntity;
import com.loihvk23.application_service.exception.ResourceNotFoundException;
import com.loihvk23.application_service.mapper.CvMapper;
import com.loihvk23.application_service.repository.CvRepository;
import com.loihvk23.application_service.service.CvService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CvServiceImpl implements CvService {
	private final CvRepository cvRepository;
	private final CvMapper mapper;

	@Override
	public CvDTO save(CvDTO cvDTO) {
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
	public void deleteCv(String cvId, String emailCandidate) {
		CvEntity cvEntity = cvRepository.findById(cvId)
				.orElseThrow(() -> new ResourceNotFoundException("Cv isn't exist !"));

		if (!cvEntity.getCandidateEmail().equalsIgnoreCase(emailCandidate)) {
			throw new IllegalArgumentException("You can't delete this CV. (Not authorization)");
		}

		cvRepository.delete(cvEntity);
	}

}
