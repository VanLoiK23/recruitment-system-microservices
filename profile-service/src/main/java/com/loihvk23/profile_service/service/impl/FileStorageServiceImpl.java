package com.loihvk23.profile_service.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.loihvk23.profile_service.document.TempMediaDocument;
import com.loihvk23.profile_service.repository.TempMediaRepository;
import com.loihvk23.profile_service.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

	private final Cloudinary cloudinary;

	private final TempMediaRepository tempMediaRepository;

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

	public String uploadCompanyFile(MultipartFile file, String folderType, String companyId) throws IOException {
		String contentType = file.getContentType();
		String resourceType = (contentType != null && contentType.equals("application/pdf")) ? "raw" : "image";

		String folderPath = String.format("techroute/companies/%s/%s", companyId, folderType.toLowerCase());

		Map<String, Object> params = ObjectUtils.asMap("folder", folderPath, "resource_type", resourceType,
				"use_filename", true, "unique_filename", true);

		Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

		String secureUrl = (String) uploadResult.get("secure_url");

		tempMediaRepository.save(TempMediaDocument.builder().fileUrl(secureUrl).createdAt(LocalDateTime.now()).build());

		return secureUrl;
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
		return fileUrl.contains("/image/upload/");
	}

	@Async
	public void deleteFilesAsync(List<String> fileUrlsToDelete) throws IOException {
		if (fileUrlsToDelete == null || fileUrlsToDelete.isEmpty())
			return;

		for (String url : fileUrlsToDelete) {
			deleteFile(url);
		}
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