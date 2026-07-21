package com.loihvk23.auth_service.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.loihvk23.auth_service.dto.UserDTO;
import com.loihvk23.auth_service.dto.request.LoginRequest;
import com.loihvk23.auth_service.dto.request.RegisterRequest;
import com.loihvk23.auth_service.entity.UserEntity;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

//	public static final UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
	
//	@Mapping(source = "avatarUrl", target = "avatar", defaultValue = "default-avatar.png") 
	public abstract UserEntity toEntity(UserDTO userDTO);
	
//	@Mapping(target = "role", constant = "candidate")
	public abstract UserEntity toEntity(RegisterRequest request);
	public abstract UserEntity toEntity(LoginRequest request);
	
	public abstract UserDTO toDTO(UserEntity userEntity);

	@AfterMapping
	protected void customMapping(UserEntity userEntity, @MappingTarget UserDTO userDTO) {
		if (userEntity.getFullName() != null && !userEntity.getFullName().isEmpty()) {
			String fullName = userEntity.getFullName().trim();
			int lastSpaceIndex = fullName.lastIndexOf(" ");

			if (lastSpaceIndex != -1) {
				userDTO.setLastName(fullName.substring(0, lastSpaceIndex)); 

				userDTO.setFirstName(fullName.substring(lastSpaceIndex + 1)); 
			} else {
				userDTO.setFirstName(fullName);
				userDTO.setLastName("");
			}
		}
	}
}
