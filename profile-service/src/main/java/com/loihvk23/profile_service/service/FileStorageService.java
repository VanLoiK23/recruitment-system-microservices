package com.loihvk23.profile_service.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
	String uploadAvatar(MultipartFile file) throws IOException;
	
	void deleteFile(String fileUrlOrPublicId) throws IOException;
	
	String uploadCompanyFile(MultipartFile file, String folderType, String companyId) throws IOException;
		
	void deleteFilesAsync(List<String> fileUrlsToDelete) throws IOException;
}
