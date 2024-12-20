package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurant")  // Corrected to match the API endpoint naming convention
@AllArgsConstructor
public class RestaurantController {

    private final RestaurentService restaurentService;

    // Test endpoint for checking the API
    @GetMapping("/test")
    public String test() {
        return "test";
    }

    // Endpoint for saving a restaurant
    @PostMapping
    public ResponseEntity<RestaurantDto> saveRestaurant(@RequestBody RestaurantDto restaurantDto) {
        RestaurantDto savedRestaurant = restaurentService.saveRestaurent(restaurantDto);
        return new ResponseEntity<>(savedRestaurant, HttpStatus.CREATED);
    }

    // Endpoint for getting a restaurant by its ID
    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable int restaurantId) {
        RestaurantDto restaurantDto = restaurentService.getRestaurantById(restaurantId);
        if (restaurantDto != null) {
            return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint for updating a restaurant
    @PutMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> updateRestaurant(
            @PathVariable int restaurantId,
            @RequestBody RestaurantDto restaurantDto) {
        RestaurantDto updatedRestaurant = restaurentService.updateRestaurant(restaurantId, restaurantDto);
        if (updatedRestaurant != null) {
            return new ResponseEntity<>(updatedRestaurant, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint for deleting a restaurant
    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable int restaurantId) {
        boolean isDeleted = restaurentService.deleteRestaurant(restaurantId);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint for getting all restaurants
    @GetMapping
    public ResponseEntity<Iterable<RestaurantDto>> getAllRestaurants() {
        Iterable<RestaurantDto> restaurantDtos = restaurentService.getAllRestaurants();
        return new ResponseEntity<>(restaurantDtos, HttpStatus.OK);
    }
}
