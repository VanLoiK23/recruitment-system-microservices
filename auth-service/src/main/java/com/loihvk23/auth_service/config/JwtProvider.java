package com.loihvk23.auth_service.config;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.loihvk23.auth_service.entity.RefreshToken;
import com.loihvk23.auth_service.entity.UserEntity;
import com.loihvk23.auth_service.repository.RefreshTokenRepository;
import com.loihvk23.auth_service.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtProvider {
	private final UserRepository userRepository;

	private final RefreshTokenRepository refreshTokenRepository;

	@Value("${app.jwt.secret}")
	private String JWT_SECRET;

	@Value("${app.jwt.expire}")
	private long JWT_EXPIRATION;

	@Value("${app.jwt.refresh-expire}")
	private long REFRESH_EXPIRATION;

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
	}

	public String generateAccessToken(Authentication authentication) throws AuthenticationException {
		String email = authentication.getName();
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

		UserEntity userEntity = userRepository.findByEmail(email)
				.orElseThrow(() -> new AuthenticationException("User not found"));

		return Jwts.builder().subject(email).claim("role", userEntity.getRole()).issuedAt(now).expiration(expiryDate)
				.signWith(getSigningKey()).compact();
	}

	// use for refresh access_token
	public String generateAccessTokenFromUser(UserEntity user) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

		return Jwts.builder().subject(user.getEmail()).claim("role", user.getRole()).issuedAt(now)
				.expiration(expiryDate).signWith(getSigningKey()).compact();
	}

	@Transactional
	public String createRefreshToken(String email) throws AuthenticationException {
		UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new AuthenticationException("User not found"));

		// delete all refreshToken before
		refreshTokenRepository.deleteByUser(user);

		String tokenString = UUID.randomUUID().toString();

		RefreshToken refreshToken = RefreshToken.builder().user(user).token(tokenString)
				.expiryDate(Instant.now().plusMillis(REFRESH_EXPIRATION)).revoked(false).build();

		refreshTokenRepository.save(refreshToken);
		return tokenString;
	}

	public RefreshToken verifyExpiration(String token) {
		RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
				.orElseThrow(() -> new IllegalArgumentException("Refresh token not exist in system!"));

		if (refreshToken.isRevoked()) {
			throw new IllegalArgumentException("Refresh token has been disabled!");
		}

		if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
			refreshTokenRepository.delete(refreshToken);
			throw new IllegalArgumentException("Refresh token is expired. Pls try login again!");
		}

		return refreshToken;
	}

	public String getEmailFromAccessToken(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload().getSubject();
	}

	public Claims getClaimsFromAccessToken(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
			return true;
		}catch (ExpiredJwtException e) {
	        System.out.println("Token đã hết hạn sử dụng!");
	        return false;
	    } catch (SignatureException e) {
	        System.out.println("Chữ ký Token không hợp lệ / Có dấu hiệu chỉnh sửa!");
	        return false;
	    } catch (JwtException | IllegalArgumentException e) {
	        System.out.println("Token bị lỗi cấu trúc hoặc rỗng!");
			return false;
		}
	}
}
