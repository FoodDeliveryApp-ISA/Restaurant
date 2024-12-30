package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/validation")
public class ValidationController {

    @Autowired
    private ValidationService validationService;

    // Endpoint to validate email character
    @PostMapping("/email")
    public ResponseEntity<String> validateEmail(@RequestParam String emailCharacter) {
        boolean isUnique = validationService.isEmailUnique(emailCharacter);
        if (isUnique) {
            return ResponseEntity.ok("Email is unique.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken.");
        }
    }

    // Endpoint to validate restaurant character
    @PostMapping("/restaurant")
    public ResponseEntity<String> validateRestaurant(@RequestParam String restaurantCharacter) {
        boolean isUnique = validationService.isRestaurantNameUnique(restaurantCharacter);
        if (isUnique) {
            return ResponseEntity.ok("Restaurant name is unique.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Restaurant name is already taken.");
        }
    }
}
