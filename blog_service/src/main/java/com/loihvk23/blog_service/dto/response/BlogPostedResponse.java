package com.loihvk23.blog_service.dto.response;

import org.springframework.data.domain.Slice;

import com.loihvk23.blog_service.dto.BlogDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostedResponse {
	private Slice<BlogDTO> blogSlice;
	private int totalElement;
}
