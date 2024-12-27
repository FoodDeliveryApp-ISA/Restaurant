package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.MenuDto;
import com.ISA.Restaurant.Dto.Request.RequestMenuSaveDto;
import com.ISA.Restaurant.Dto.Request.RequestUpdatedMenuDto;
import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import com.ISA.Restaurant.service.MenuService;
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
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Private helper method to check if the user is authenticated
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

            Optional<Restaurant> restaurantOpt = restaurantRepository.findByRestaurantEmail(email);
            log.info("getAuthenticatedRestaurant(): Restaurant found: {}", restaurantOpt);
            if (restaurantOpt.isPresent()) {
                return restaurantOpt.get();
            } else {
                log.warn("getAuthenticatedRestaurant(): No restaurant found for email: {}", email);
            }
        } else {
            log.warn("getAuthenticatedRestaurant(): Unexpected principal type: {}", principal);
        }

        return null; // Authentication failed or unknown principal type
    }

    @PostMapping
    public ResponseEntity<?> createMenu(@RequestBody RequestMenuSaveDto menu) {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();

        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in as a restaurant.");
        }
        // Associate the restaurant directly
        return ResponseEntity.ok(menuService.saveMenu(menu,authenticatedRestaurant));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuById(@PathVariable Long id) {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();

        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in as a restaurant.");
        }

        MenuDto menu = menuService.getMenuById(id);

//        // Ensure the menu belongs to the authenticated restaurant
//        if (!menu.getRestaurant().getId().equals(authenticatedRestaurant.getId())) {
//            return ResponseEntity.status(403).body("Forbidden: You do not have access to this menu.");
//        }

        return ResponseEntity.ok(menu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenu(
            @PathVariable Long id,
            @RequestBody RequestUpdatedMenuDto menu
    ) {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();
        log.info("*updateMenu(): AuthenticatedRestaurant: {}", authenticatedRestaurant);

        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in as a restaurant.");
        }

        // Ensure the menu belongs to the authenticated restaurant
        MenuDto existingMenu = menuService.getMenuById(id);
        log.info("*updateMenu(): existingMenu: {}", existingMenu);
//        if (!existingMenu.getRestaurant().getId().equals(authenticatedRestaurant.getId())) {
//            return ResponseEntity.status(403).body("Forbidden: You do not have access to update this menu.");
//        }

//        menu.setRestaurant(authenticatedRestaurant); // Ensure association
        return ResponseEntity.ok(menuService.updateMenu(id, menu));
    }

    @GetMapping
    public ResponseEntity<?> getAllMenus() {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();

        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in as a restaurant.");
        }

        // Fetch only menus belonging to the authenticated restaurant
        List<MenuDto> menus = menuService.getMenusByRestaurant(authenticatedRestaurant);
        if (menus.isEmpty()) {
            return ResponseEntity.ok("No menus found for your restaurant.");
        }

        return ResponseEntity.ok(menus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenu(@PathVariable Long id) {
        Restaurant authenticatedRestaurant = getAuthenticatedRestaurant();
        log.info("*deleteMenu(): AuthenticatedRestaurant: {}", authenticatedRestaurant);

        if (authenticatedRestaurant == null) {
            return ResponseEntity.status(403).body("Unauthorized: Please log in as a restaurant.");
        }

        // Ensure the menu exists and belongs to the authenticated restaurant
        MenuDto existingMenu = menuService.getMenuById(id);
        log.info("*deleteMenu(): existingMenu: {}", existingMenu);

        if (existingMenu == null) {
            return ResponseEntity.status(404).body("Menu not found.");
        }

//        // Assuming the MenuDto contains the restaurant ID, verify ownership
//        if (!existingMenu.getRestaurantId().equals(authenticatedRestaurant.getId())) {
//            return ResponseEntity.status(403).body("Forbidden: You do not have access to delete this menu.");
//        }

        // Perform the delete operation
        menuService.deleteMenu(id);
        return ResponseEntity.ok("Menu deleted successfully.");
    }

}
