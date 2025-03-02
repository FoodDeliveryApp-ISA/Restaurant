package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.service.MenuItemService;
import com.ISA.Restaurant.service.MenuService;
import com.ISA.Restaurant.service.OrderService;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/cache")
@AllArgsConstructor
public class CacheController {

    private final RestaurentService restaurantService;
    private final MenuService menuService;
    private final MenuItemService menuItemService;
//    private final OrderService orderService;

    // Endpoint for clearing all caches
    @PostMapping("/clear")
    public ResponseEntity<Void> clearAllCaches() {
        try {
            // Clear restaurant-related caches
            restaurantService.evictCacheOnLogout();
            log.info("Restaurant-related caches cleared successfully.");

            // Clear menu-related caches
            menuService.evictMenuCache();
            log.info("Menu-related caches cleared successfully.");

            // Clear menu-item-related caches
            menuItemService.evictMenuItemCache();
            log.info("Menu-item-related caches cleared successfully.");

            // Clear order-related caches
//            orderService.evictOrderCache();
            log.info("Order-related caches cleared successfully.");

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error clearing caches.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
