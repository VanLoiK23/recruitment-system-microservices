package com.loihvk23.blog_service.service.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.loihvk23.blog_service.service.CloudinaryService;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

	private final Cloudinary cloudinary;

	private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".webp");

	public CloudinaryServiceImpl(Cloudinary cloudinary) {
		this.cloudinary = cloudinary;
	}

	@Override
	public String uploadImg(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Blog image file is required!");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || !isValidImageExtension(originalFilename)) {
			throw new IllegalArgumentException("Only .jpg, .jpeg, .png, .webp image formats are accepted!");
		}

		Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "blogs",
				"public_id", UUID.randomUUID().toString(), "resource_type", "image"));

		return uploadResult.get("secure_url").toString();
	}

	@Override
	public void deleteFile(String fileUrlOrPublicId) throws IOException {
		if (fileUrlOrPublicId == null || fileUrlOrPublicId.isBlank()) {
			return;
		}

		String publicId = extractPublicId(fileUrlOrPublicId);

		cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
	}

	private String extractPublicId(String fileUrl) {
		if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
			return fileUrl;
		}

		int uploadIndex = fileUrl.indexOf("/upload/");
		if (uploadIndex != -1) {
			String pathAfterUpload = fileUrl.substring(uploadIndex + 8);
			String withoutVersion = pathAfterUpload.replaceFirst("^v\\d+/", "");
			
			int lastDotIndex = withoutVersion.lastIndexOf(".");
			if (lastDotIndex != -1) {
				return withoutVersion.substring(0, lastDotIndex);
			}
			return withoutVersion;
		}

		return fileUrl;
	}

	private boolean isValidImageExtension(String filename) {
		String lowerName = filename.toLowerCase();
		return ALLOWED_EXTENSIONS.stream().anyMatch(lowerName::endsWith);
	}
}