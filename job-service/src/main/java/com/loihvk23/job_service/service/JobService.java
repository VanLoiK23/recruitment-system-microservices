package com.loihvk23.job_service.service;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.loihvk23.job_service.dto.JobDTO;
import com.loihvk23.job_service.dto.request.AdvanceFilterRequest;

public interface JobService {
	Slice<JobDTO> findAll(Pageable pageable);
	
	Slice<JobDTO> findByRecruiter(String recruiterEmail, Pageable pageable);
	
	JobDTO createNewJob(JobDTO jobDTO,String recruiterEmail);
	
	JobDTO updateJob(JobDTO jobDTO, String jobId,String recruiterEmail);
	
	void deleteJob(String jobId, String recruiterEmail);

	JobDTO findDetailJob(String jobId);

//	Slice<JobDTO> filterJobsByRangeSalary(Double minSalary,Double maxSalary, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologies(String technology, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologiesAndJobLevel(String technology, String jobLevel, Pageable pageable);
//	
//	Slice<JobDTO> filterJobsByTechnologiesJobLevelAndLocation(String technology, String jobLevel, String location, Pageable pageable);
	Slice<JobDTO> findJobRelevants(List<String> technologies, Pageable pageable);
	
	Slice<JobDTO> filterAdvanceJobs(AdvanceFilterRequest searchRequest, Pageable pageable);
}
