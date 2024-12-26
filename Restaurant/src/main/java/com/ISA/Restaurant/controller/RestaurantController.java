package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.RestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.service.RestaurentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants/")  // Corrected to match the API endpoint naming convention
@AllArgsConstructor
public class RestaurantController {

    private final RestaurentService restaurantService;

    // Test endpoint for checking the API
    @GetMapping("/test")
    public String test() {
        return "test";
    }

    // Endpoint for saving a restaurant
    @PostMapping
    public ResponseEntity<RestaurantDto> createRestaurant(@RequestBody RestaurantDto restaurantDto) {
        System.out.println("1  "+restaurantDto);
        RestaurantDto savedRestaurant = restaurantService.saveRestaurent(restaurantDto);
        System.out.println("2 "+savedRestaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRestaurant);
    }

    // Endpoint for getting a restaurant by its ID
    @GetMapping("{restaurantId}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable int restaurantId) {
        RestaurantDto restaurantDto = restaurantService.getRestaurantById(restaurantId);
        if (restaurantDto != null) {
            return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint for updating a restaurant
    @PutMapping("{restaurantId}")
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
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint for getting all restaurants
    @GetMapping
    public ResponseEntity<Iterable<RestaurantDto>> getAllRestaurants() {
        Iterable<RestaurantDto> restaurantDtos = restaurantService.getAllRestaurants();
        return new ResponseEntity<>(restaurantDtos, HttpStatus.OK);
    }
}
