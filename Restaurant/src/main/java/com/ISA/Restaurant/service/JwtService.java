package com.ISA.Restaurant.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public long getExpirationTime() {
        return jwtExpiration;
    }// Token expiration time in milliseconds

    /**
     * Extracts the username (subject) from the JWT token.
     * @param token the JWT token
     * @return the username
     */
    public String extractUsername(String token) {
        log.info("passed token: {}", token);
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a specific claim from the token.
     * @param token the JWT token
     * @param claimsResolver a function to resolve the claim
     * @param <T> the type of the claim
     * @return the resolved claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        log.info("passed token: {}", token);
        final Claims claims = extractAllClaims(token);
        log.info("claims2: {}", claims);
        return claimsResolver.apply(claims);
    }

    /**
     * Generates a token for the provided UserDetails without extra claims.
     * @param userDetails the user details
     * @return the generated token
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a token for the provided UserDetails with additional claims.
     * @param extraClaims extra claims to include in the token
     * @param userDetails the user details
     * @return the generated token
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Builds the token with claims, expiration, and signature.
     * @param extraClaims extra claims
     * @param userDetails the user details
     * @param expiration expiration time in milliseconds
     * @return the built token
     */
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

    /**
     * Checks if the token is valid for the given UserDetails.
     * @param token the JWT token
     * @param userDetails the user details
     * @return true if valid, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if the token has expired.
     * @param token the JWT token
     * @return true if expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date from the token.
     * @param token the JWT token
     * @return the expiration date
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from the token.
     * @param token the JWT token
     * @return the claims
     */

        public Claims extractAllClaims(String token) {
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


    /**
     * Retrieves the signing key based on the secret key.
     * @return the signing key
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


}
