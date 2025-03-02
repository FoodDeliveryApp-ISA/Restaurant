package com.ISA.Restaurant.config;

import com.ISA.Restaurant.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService,
            HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        log.info("Authorization header: {}", authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("No Bearer token found in Authorization header.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7); // Extract the token
            log.info("Extracted JWT: {}", jwt);

            final String userEmail = jwtService.extractUsername(jwt); // Extract email/username from the token
            log.info("Extracted user email: {}", userEmail);

            // Check if user is already authenticated
            Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail != null && existingAuth == null) {
                log.info("No existing authentication found, validating token...");

                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                log.info("Loaded UserDetails: {}", userDetails);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.info("JWT is valid. Setting authentication context.");

                    // Create an authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Set authentication details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication context updated successfully.");
                } else {
                    log.warn("Invalid JWT token.");
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Exception occurred while processing JWT: {}", e.getMessage(), e);
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
