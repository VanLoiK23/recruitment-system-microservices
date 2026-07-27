package com.loihvk23.job_service.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.loihvk23.job_service.document.JobDocument;
import com.loihvk23.job_service.document.SavedJobDocument;
import com.loihvk23.job_service.dto.SavedJobDTO;
import com.loihvk23.job_service.mapper.JobMapper;
import com.loihvk23.job_service.mapper.SavedJobMapper;
import com.loihvk23.job_service.repository.JobRepository;
import com.loihvk23.job_service.repository.SavedJobRepository;
import com.loihvk23.job_service.service.SavedJobService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {
	private final SavedJobRepository savedJobRepository;

	private final SavedJobMapper mapper;

	private final JobRepository jobRepository;

	private final JobMapper jobMapper;

	@Override
	public void saveJob(String jobId, String userEmail) {
		if (checkJobIsSaved(jobId, userEmail)) {
			// unsave job
			savedJobRepository.deleteByUserEmailAndJobId(userEmail, jobId);
		}
		SavedJobDocument savedJobDocument = SavedJobDocument.builder().userEmail(userEmail).jobId(jobId)
				.createdAt(LocalDateTime.now()).build();

		savedJobRepository.save(savedJobDocument);
	}

	@Override
	public boolean checkJobIsSaved(String jobId, String userEmail) {
		List<SavedJobDocument> savedJobDocuments = savedJobRepository.findByUserEmailAndJobId(userEmail, jobId);

		if (savedJobDocuments != null && !savedJobDocuments.isEmpty()) {
			return true;
		}
		return false;
	}

	@Override
	public Slice<SavedJobDTO> findSavedJobsByUser(String userEmail, Pageable pageable) {
		Slice<SavedJobDocument> saveJobs = savedJobRepository.findByUserEmail(userEmail, pageable);

		Slice<SavedJobDTO> saveJobDTOs = saveJobs.map(savedJob -> {
			SavedJobDTO dto = mapper.toDTO(savedJob);

			JobDocument jobDocument = jobRepository.findById(dto.getJobId()).orElse(null);

			if (jobDocument != null) {
				dto.setJob(jobMapper.toDTO(jobDocument));
			}

			return dto;
		});

		return saveJobDTOs;
	}

}
