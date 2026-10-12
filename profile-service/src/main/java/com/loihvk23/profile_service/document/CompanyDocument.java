package com.loihvk23.profile_service.document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.loihvk23.profile_service.VerificationStatus;
import com.loihvk23.profile_service.dto.CompanyLocation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "companies")
public class CompanyDocument {

    @Id
    private String id;

    @Indexed
    private String ownerEmail; // Email of Recruiter create company Profile
    
    private VerificationStatus verificationStatus; 

    private String businessLicenseUrl; // url img/pdf to show license of company

    @Indexed
    private String companyName;

    private String website;

    private String logoUrl;

    private String coverImageUrl;

    private String industry; 

    private String companySize;

    @Indexed(unique = true, sparse = true)
    private String taxId; 

    private String aboutUs;

    private CompanyLocation headquarters;

    @Builder.Default
    private List<CompanyLocation> branches = new ArrayList<>();

    @Builder.Default
    private List<String> benefits = new ArrayList<>();

    @Builder.Default
    private List<String> galleryImages = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}