package com.loihvk23.application_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.loihvk23.application_service.dto.CvDTO;
import com.loihvk23.application_service.entity.CvEntity;
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
	public List<CvDTO> getCvs(String candidateEmail) {
		List<CvEntity> cvEntities = cvRepository.findByCandidateEmail(candidateEmail);
		List<CvDTO> cvdtos = cvEntities.stream().map(mapper::toDTO).collect(Collectors.toList());
		return cvdtos;
	}

}
