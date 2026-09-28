package com.loihvk23.profile_service.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
	String uploadAvatar(MultipartFile file) throws IOException;
	
	void deleteAvatar(String fileUrlOrPublicId) throws IOException;
}
