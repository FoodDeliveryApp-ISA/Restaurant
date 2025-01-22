package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Request.ChangePasswordDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/restaurants")
public class PasswordController {

    private final AuthenticationService authenticationService;
    private final RestaurantRepository restaurantRepository;

    public PasswordController(AuthenticationService authenticationService,
                              RestaurantRepository restaurantRepository) {
        this.authenticationService = authenticationService;
        this.restaurantRepository = restaurantRepository;
    }

    private Restaurant getAuthenticatedRestaurant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("getAuthenticatedRestaurant(): Authentication is null or user is not authenticated");
            return null; // Not authenticated
        }

        Object principal = authentication.getPrincipal();
        log.info("getAuthenticatedRestaurant(): Principal: {}", principal);

        if (principal instanceof Restaurant) {
            String email = ((Restaurant) principal).getUsername();
            log.info("getAuthenticatedRestaurant(): Restaurant email: {}", email);

            return restaurantRepository.findByRestaurantEmail(email).orElse(null);
        } else {
            log.warn("getAuthenticatedRestaurant(): Unexpected principal type: {}", principal);
        }

        return null; // Authentication failed or unknown principal type
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        log.info("Change password request received.");

        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();
        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in to change your password.");
        }


        try {
            authenticationService.changePassword(authenticatedRestaurant.getRestaurantEmail(), changePasswordDto.getOldPassword(), changePasswordDto.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (RuntimeException e) {
            log.error("Failed to change password: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to change password: " + e.getMessage());
        }
    }
}
