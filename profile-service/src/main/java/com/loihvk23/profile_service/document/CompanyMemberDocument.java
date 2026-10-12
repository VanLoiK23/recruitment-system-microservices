package com.loihvk23.profile_service.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.loihvk23.profile_service.CompanyMemberRole;
import com.loihvk23.profile_service.CompanyMemberStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Document(collection = "company_members")
@CompoundIndexes({
	@CompoundIndex(name = "company_role_req_idx", def = "{'companyId': 1, 'role': 1, 'requestedAt': 1}"),
	@CompoundIndex(name = "unique_member_company_idx", def = "{'companyId': 1, 'recruiterEmail': 1}", unique = true)
})
public class CompanyMemberDocument {
	@Id
	private String id;

	private String companyId; 
	
	@Indexed
	private String recruiterEmail;

	@Builder.Default
	private CompanyMemberRole role = CompanyMemberRole.RECRUITER;
	
	@Builder.Default
	private CompanyMemberStatus status = CompanyMemberStatus.PENDING;
	
	@Builder.Default
	private LocalDateTime requestedAt = LocalDateTime.now();

	private LocalDateTime joinedAt;
}