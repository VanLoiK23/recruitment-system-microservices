package com.loihvk23.profile_service.dto;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyLocation {

	@NotBlank(message = "Detailed address is required")
	@Size(max = 255, message = "Address cannot exceed 255 characters")
	private String address;

	@NotBlank(message = "District is required")
	@Size(max = 100, message = "District cannot exceed 100 characters")
	private String district;

	@NotBlank(message = "City/Province is required")
	@Size(max = 100, message = "City/Province cannot exceed 100 characters")
	private String cityProvince;

	@NotBlank(message = "Country is required")
	private String country;

	@GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
	private GeoJsonPoint coordinates;

	private Boolean isHeadquarters;
}