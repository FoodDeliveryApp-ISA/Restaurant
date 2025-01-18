package com.ISA.Restaurant.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey; // Loaded from application.properties or application.yml

    @Value("${security.jwt.expiration-time}0")
    private long jwtExpiration;

    @Value("${security.jwt.reset-token-expiration-time}")
    private long resetTokenExpiration;

    public long getExpirationTime() {
        return jwtExpiration;
    }// Token expiration time in milliseconds

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver)
    {
        final Claims claims = extractAllClaims(token);
        log.info("claims: {}", claims);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {

        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        try {
            log.info("Token: {}", token);
            log.info("Signing Key: {}", getSignInKey());

            // Parse JWT token
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())  // Set the signing key
                    .build()
                    .parseClaimsJws(token)         // Parse the JWT
                    .getBody();                    // Get the claims body
        } catch (ExpiredJwtException e) {
            log.error("Token is expired: {}", e.getMessage());
            throw new RuntimeException("Token has expired");
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT: {}", e.getMessage());
            throw new RuntimeException("Unsupported JWT");
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT: {}", e.getMessage());
            throw new RuntimeException("Malformed JWT token");
        } catch (SignatureException e) {
            log.error("Signature validation failed: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT signature");
        } catch (JwtException e) {
            log.error("JWT parsing error: {}", e.getMessage());
            throw new RuntimeException("Error parsing JWT token");
        }
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String generateResetToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "RESET");
        return buildToken(claims, email, resetTokenExpiration);
    }
    public String validateResetToken(String token) {
        try {
            String email = extractUsername(token);
            Map<String, Object> claims = extractAllClaims(token);
            if (!"RESET".equals(claims.get("type"))) {
                throw new RuntimeException("Invalid token type");
            }
            return email;
        } catch (RuntimeException e) {
            log.error("Invalid reset token: {}", e.getMessage());
            throw new RuntimeException("Reset token is invalid or expired");
        }
    }
    private String buildToken(
            Map<String, Object> extraClaims,
            String subject,
            long expiration
    ) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
