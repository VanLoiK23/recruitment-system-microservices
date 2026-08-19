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
		if (originalFilename == null) {
			throw new IllegalArgumentException("Invalid file name!");
		}

		String lowerFilename = originalFilename.toLowerCase();
		boolean isPdf = lowerFilename.endsWith(".pdf");
		boolean isWord = lowerFilename.endsWith(".docx") || lowerFilename.endsWith(".doc");

		if (!isPdf && !isWord) {
			throw new IllegalArgumentException("Only .pdf or .docx/.doc formats are accepted!");
		}

		String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
		String uniqueId = UUID.randomUUID().toString();

		Map<?, ?> uploadResult;

		if (isPdf) {
			String publicId = "recuriment_csv/" + uniqueId;
			uploadResult = cloudinary.uploader().upload(file.getBytes(),
					ObjectUtils.asMap("public_id", publicId, "resource_type", "image", "format", "pdf"));
		} else {
			String publicId = "recuriment_csv/" + uniqueId + extension;
			uploadResult = cloudinary.uploader().upload(file.getBytes(),
					ObjectUtils.asMap("public_id", publicId, "resource_type", "raw"));
		}

		return uploadResult.get("secure_url").toString();
	}

	@Override
	public void deleteFile(String fileUrlOrPublicId) throws IOException {
		if (fileUrlOrPublicId == null || fileUrlOrPublicId.isBlank()) {
			return;
		}

		String publicId = extractPublicId(fileUrlOrPublicId);
		String resourceType = isImageResourceType(fileUrlOrPublicId) ? "image" : "raw";

		cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
	}

	private boolean isImageResourceType(String fileUrl) {
		return fileUrl.contains("/image/upload/") || fileUrl.toLowerCase().endsWith(".pdf");
	}

	private String extractPublicId(String fileUrl) {
		if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
			return fileUrl;
		}

		int uploadIndex = fileUrl.indexOf("/upload/");
		if (uploadIndex != -1) {
			String pathAfterUpload = fileUrl.substring(uploadIndex + 8);
			String cleanPath = pathAfterUpload.replaceFirst("^v\\d+/", "");

			if (isImageResourceType(fileUrl) && cleanPath.endsWith(".pdf")) {
				cleanPath = cleanPath.substring(0, cleanPath.lastIndexOf("."));
			}
			return cleanPath;
		}

		return fileUrl;
	}
}