package com.loihvk23.profile_service.service;

import com.loihvk23.profile_service.dto.ProfileDTO;

public interface ProfileService {
	ProfileDTO saveProfile(ProfileDTO profileDTO,String emailCandidate);
	
	ProfileDTO findProfileByEmail(String emailCandidate);
}
