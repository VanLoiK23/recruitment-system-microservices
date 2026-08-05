package com.loihvk23.application_service.service.impl;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.loihvk23.application_service.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

	private final Cloudinary cloudinary;

	@Override
	public String uploadCV(MultipartFile file) throws IOException {
		if (file.isEmpty()) {
			throw new IllegalArgumentException("File CV is required");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || (!originalFilename.endsWith(".pdf") && !originalFilename.endsWith(".docx") && !originalFilename.endsWith(".doc"))) {
			throw new IllegalArgumentException("Only .pdf or .docx/.doc formats are accepted!");
		}

		String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
		String publicId = "recuriment_csv/" + UUID.randomUUID().toString() + extension;

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
				ObjectUtils.asMap("public_id", publicId, "resource_type", "raw"));

		return uploadResult.get("secure_url").toString();
	}
	
	@Override
    public void deleteFile(String fileUrlOrPublicId) throws IOException {
        if (fileUrlOrPublicId == null || fileUrlOrPublicId.isBlank()) {
            return;
        }

        String publicId = extractPublicId(fileUrlOrPublicId);

        Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
    }

    private String extractPublicId(String fileUrl) {
        if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
            return fileUrl; 
        }
        
        int uploadIndex = fileUrl.indexOf("/upload/");
        if (uploadIndex != -1) {
            String pathAfterUpload = fileUrl.substring(uploadIndex + 8);
            return pathAfterUpload.replaceFirst("^v\\d+/", "");
        }
        
        return fileUrl;
    }
}
