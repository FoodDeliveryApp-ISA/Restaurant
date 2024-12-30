package com.ISA.Restaurant.service;

import com.ISA.Restaurant.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Method to check if the email is already registered
    public boolean isEmailUnique(String email) {
        // Check if the email is already registered
        return !restaurantRepository.findByRestaurantEmail(email).isPresent();
    }

    // Method to check if the restaurant name is already taken
    public boolean isRestaurantNameUnique(String restaurantName) {
        // Check if the restaurant name is already registered
        return !restaurantRepository.findByRestaurantName(restaurantName).isPresent();
    }
}