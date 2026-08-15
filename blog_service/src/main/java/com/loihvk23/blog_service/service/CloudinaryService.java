package com.loihvk23.blog_service.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
	String uploadImg(MultipartFile file) throws IOException;
	
	void deleteFile(String fileUrlOrPublicId) throws IOException;
}
