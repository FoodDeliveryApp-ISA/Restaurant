package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/restaurants")  // Corrected to match the API endpoint naming convention
@AllArgsConstructor
public class RestaurantController {

    private final RestaurentService restaurantService;

    // Test endpoint for checking the API
    @GetMapping("/test")
    public String test() {
        log.info("Test endpoint hit");
        return "test";
    }

    // Endpoint for getting a restaurant by its ID
    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable int restaurantId) {
        log.info("getRestaurantById(): restaurantId: {}", restaurantId);
        RestaurantDto restaurantDto = restaurantService.getRestaurantById(restaurantId);
        log.info("getRestaurantById(): RestaurantDto: {}", restaurantDto);
        return restaurantDto != null ?
                ResponseEntity.ok(restaurantDto) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Endpoint for updating a restaurant
    @PutMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> updateRestaurant(
            @PathVariable int restaurantId,
            @RequestBody RestaurantDto restaurantDto) {
        RestaurantDto updatedRestaurant = restaurantService.updateRestaurant(restaurantId, restaurantDto);
        if (updatedRestaurant != null) {
            return new ResponseEntity<>(updatedRestaurant, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // Endpoint for deleting a restaurant
    @DeleteMapping("{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable int restaurantId) {
        boolean isDeleted = restaurantService.deleteRestaurant(restaurantId);
        return isDeleted ?
                ResponseEntity.noContent().build() :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    // Private helper method to check if the user is authenticated
    private RestaurantDto getAuthenticatedRestaurant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.info("getAuthenticatedRestaurant(): Authentication is null or user is not authenticated");
            return null; // Not authenticated
        }

        Object principal = authentication.getPrincipal();
        log.info("getAuthenticatedRestaurant(): Principal: {}", principal);
        if (principal instanceof Restaurant) {
            String email = ((Restaurant) principal).getUsername();
            log.info("getAuthenticatedRestaurant(): Restaurant email: {}", email);
            return restaurantService.findByRestaurentEmail(email);
        }

        log.warn("getAuthenticatedRestaurant(): Unknown principal type: {}", principal);
        return null; // Unknown principal type
    }

    // Endpoint for getting authenticated restaurant details
    @GetMapping("/auth")
    public ResponseEntity<RestaurantDto> getAuthenticatedRestaurantDetails() {
        log.info("getAuthenticatedRestaurant()");
        RestaurantDto currentRestaurant = getAuthenticatedRestaurant();
        log.info("getAuthenticatedRestaurantDetails(): Current Restaurant: {}", currentRestaurant);

        if (currentRestaurant == null) {
            log.info("getAuthenticatedRestaurantDetails(): User is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(currentRestaurant);
    }

    // Endpoint for updating a restaurant (authenticated)
    @PutMapping("/auth")
    public ResponseEntity<RestaurantDto> updateAuthenticatedRestaurant(@RequestBody RestaurantDto restaurantDto) {
        RestaurantDto currentRestaurant = getAuthenticatedRestaurant();

        if (currentRestaurant == null) {
            log.info("updateAuthenticatedRestaurant(): User is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        RestaurantDto updatedRestaurant = restaurantService.updateRestaurant(currentRestaurant.getRestaurantId(), restaurantDto);
        return updatedRestaurant != null ?
                ResponseEntity.ok(updatedRestaurant) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Endpoint for deleting a restaurant (authenticated)
    @DeleteMapping("/auth")
    public ResponseEntity<Void> deleteAuthenticatedRestaurant() {
        RestaurantDto currentRestaurant = getAuthenticatedRestaurant();

        if (currentRestaurant == null) {
            log.info("deleteAuthenticatedRestaurant(): User is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isDeleted = restaurantService.deleteRestaurant(currentRestaurant.getRestaurantId());
        return isDeleted ?
                ResponseEntity.noContent().build() :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    // Endpoint for clearing all restaurant-related cache entries (logout)
    @PostMapping("/logout/evict-cache")
    public ResponseEntity<Void> evictCacheOnLogout() {
        try {
            restaurantService.evictCacheOnLogout();
            log.info("Cache cleared successfully on logout.");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error clearing cache on logout.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
