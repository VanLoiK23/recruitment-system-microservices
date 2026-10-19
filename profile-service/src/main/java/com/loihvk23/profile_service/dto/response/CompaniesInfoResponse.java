package com.loihvk23.profile_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@Builder 
@AllArgsConstructor
@NoArgsConstructor
public class CompaniesInfoResponse {
    private String id;

    private String role;

    private String name;
    
    private String logo;
}
