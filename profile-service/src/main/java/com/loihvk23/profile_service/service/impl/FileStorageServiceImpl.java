package com.loihvk23.profile_service.service.impl;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.loihvk23.profile_service.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

	private final Cloudinary cloudinary;

	@Override
	public String uploadAvatar(MultipartFile file) throws IOException {
		if (file.isEmpty()) {
			throw new IllegalArgumentException("File avatar is required");
		}

		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new IllegalArgumentException("Invalid file type! Only image files are allowed.");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null) {
			throw new IllegalArgumentException("Invalid file name!");
		}

		String uniqueId = UUID.randomUUID().toString();
		String publicId = "recruitment_avatar/" + uniqueId;

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
				ObjectUtils.asMap("public_id", publicId, "resource_type", "image"));

		return uploadResult.get("secure_url").toString();
	}

	@Override
	public void deleteAvatar(String fileUrlOrPublicId) throws IOException {
		if (fileUrlOrPublicId == null || fileUrlOrPublicId.isBlank()) {
			return;
		}

		String publicId = extractPublicId(fileUrlOrPublicId);
		String resourceType = isImageResourceType(fileUrlOrPublicId) ? "image" : "raw";

		cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
	}

	private boolean isImageResourceType(String fileUrl) {
		return fileUrl.contains("/image/upload/");
	}

	private String extractPublicId(String fileUrl) {
		if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
			return fileUrl;
		}

		int uploadIndex = fileUrl.indexOf("/upload/");
		if (uploadIndex != -1) {
			String pathAfterUpload = fileUrl.substring(uploadIndex + 8);
			String cleanPath = pathAfterUpload.replaceFirst("^v\\d+/", "");

			int lastDotIndex = cleanPath.lastIndexOf(".");
			if (lastDotIndex != -1) {
				cleanPath = cleanPath.substring(0, lastDotIndex);
			}
			return cleanPath;
		}

		return fileUrl;
	}
}