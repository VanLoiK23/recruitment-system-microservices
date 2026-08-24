package com.loihvk23.profile_service.service;

import com.loihvk23.profile_service.dto.CandidateProfileDTO;
import com.loihvk23.profile_service.dto.RecruiterProfileDTO;

public interface ProfileService {
	CandidateProfileDTO saveCandidateProfile(CandidateProfileDTO candidateProfileDTO,String emailCandidate);
	
	CandidateProfileDTO findCandidateProfileByEmail(String emailCandidate);
	
	RecruiterProfileDTO saveRecruiterProfile(RecruiterProfileDTO recruiterProfileDTO,String emailRecruiter);
	
	RecruiterProfileDTO findRecruiterProfileByEmail(String emailRecruiter);
}
