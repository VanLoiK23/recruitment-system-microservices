package com.loihvk23.application_service.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
	String uploadCV(MultipartFile file) throws IOException;
}
