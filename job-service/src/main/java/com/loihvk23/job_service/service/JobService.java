package com.loihvk23.job_service.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.AdvanceFilterRequest;
import com.loihvk23.job_service.dto.response.JobPostedResponse;
import com.loihvk23.job_service.dto.response.JobManagementResponse;

public interface JobService {
	Slice<JobDTO> findAll(Pageable pageable, String email);

	Slice<JobDTO> findByRecruiter(String recruiterEmail, Pageable pageable);

	int getTotalElementJobByRecruiter(String recruiterEmail);

	JobPostedResponse getJobPostedByRecruiter(String recruiterEmail, String query, String status, Pageable pageable);

	JobDTO approveJob(String jobId);

	JobDTO saveDraft(JobDTO jobDTO, String recruiterEmail);

	JobDTO getJobDraft(String recruiterEmail);

	JobDTO createNewJob(JobDTO jobDTO, String recruiterEmail, String role);

	JobDTO updateJob(JobDTO jobDTO, String jobId, String recruiterEmail, String role);

	void deleteJob(String jobId, String recruiterEmail, String role);

	JobDTO findDetailJob(String jobId, String email);

//	Slice<JobDTO> filterJobsByRangeSalary(Double minSalary,Double maxSalary, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologies(String technology, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologiesAndJobLevel(String technology, String jobLevel, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologiesJobLevelAndLocation(String technology, String jobLevel, String location, Pageable pageable);
	Slice<JobDTO> findJobRelevants(List<String> technologies, String jobId, Pageable pageable, String email);

	Page<JobDTO> filterAdvanceJobs(AdvanceFilterRequest searchRequest, Pageable pageable, String email);

	void incrementApplicantCount(String jobId);

	void saveViewedJobHistory(String emailCandidate, String jobId);

	Slice<JobManagementResponse> getViewdJobs(String emailCandidate, Pageable pageable);
}
