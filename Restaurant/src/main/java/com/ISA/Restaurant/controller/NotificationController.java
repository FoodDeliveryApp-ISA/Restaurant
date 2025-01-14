package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Entity.Notification;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.service.NotificationService;
import com.ISA.Restaurant.repo.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final RestaurantRepository restaurantRepository;

    @Autowired
    public NotificationController(NotificationService notificationService, RestaurantRepository restaurantRepository) {
        this.notificationService = notificationService;
        this.restaurantRepository = restaurantRepository;
    }

    private Restaurant getAuthenticatedRestaurant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Authentication is null or user is not authenticated.");
            return null; // Not authenticated
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Restaurant) {
            String email = ((Restaurant) principal).getUsername();
            Optional<Restaurant> restaurantOpt = restaurantRepository.findByRestaurantEmail(email);
            return restaurantOpt.orElse(null);
        }

        log.warn("Unexpected principal type: {}", principal);
        return null;
    }

    @GetMapping("/restaurant-notifications")
    public ResponseEntity<List<Notification>> getNotificationsForAuthenticatedRestaurant() {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();
        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        String restaurantId = String.valueOf(authenticatedRestaurant.getRestaurantId());
        List<Notification> notifications = notificationService.getNotificationsForUser(restaurantId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotificationToUser(
            @RequestParam String userId,
            @RequestParam String message) {
        notificationService.sendNotificationToUser(userId, message);
        return ResponseEntity.ok("Notification sent to user: " + userId);
    }

    @PatchMapping("/mark-read/{notificationId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("Notification marked as read.");
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead() {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();
        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        String restaurantId = String.valueOf(authenticatedRestaurant.getRestaurantId());
        notificationService.markAllAsRead(restaurantId);
        return ResponseEntity.ok("All notifications marked as read.");
    }
}




