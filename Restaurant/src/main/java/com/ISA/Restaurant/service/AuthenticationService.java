package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.Request.ForgetPasswordDto;
import com.ISA.Restaurant.Dto.Request.RegisterRequest;
import com.ISA.Restaurant.Dto.Request.LoginRequest;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.exception.EmailAlreadyExistsException;
import com.ISA.Restaurant.exception.RestaurantNotFoundException;
import com.ISA.Restaurant.repo.RestaurantRepository;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationService {



    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    public AuthenticationService(
            RestaurantRepository restaurantRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder

    ) {
        this.authenticationManager = authenticationManager;
        this.restaurantRepository = restaurantRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public Restaurant signup(RegisterRequest input) {
        log.info("Registering new restaurant with email {} and name {}", input.getRestaurantEmail(), input.getRestaurantName());

        String email = input.getRestaurantEmail().trim();
        // Check if email already exists
        if (restaurantRepository.findByRestaurantEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email " + email + " is already in use.");
        }

        // Check if restaurant name already exists
        if (restaurantRepository.findByRestaurantName(input.getRestaurantName()).isPresent()) {
            throw new RuntimeException("Restaurant name " + input.getRestaurantName() + " is already in use.");
        }

        Restaurant restaurant = new Restaurant(
                input.getRestaurantName(),
                input.getRestaurantEmail(),
                passwordEncoder.encode(input.getRestaurantPassword()),
                input.getRestaurantAddress(),
                input.getRestaurantPhone(),
                input.getRestaurantCity(),
                input.getRestaurantLocation(),
                true, // isActive
                ""    // other details
        );

        return restaurantRepository.save(restaurant);
    }


    public Restaurant authenticate(LoginRequest input) {
        log.info("Authenticating user {}", input.getEmail());
        Restaurant restaurant = restaurantRepository.findByRestaurantEmail(input.getEmail())
                .orElseThrow(() -> {
                    System.err.println("Restaurant with email " + input.getEmail() + " not found.");
                    return new RuntimeException("Restaurant not found");
                });

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return restaurant;
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        log.info("Changing password for email: {}", email);

        // Find the restaurant by email
        Restaurant restaurant = restaurantRepository.findByRestaurantEmail(email)
                .orElseThrow(() -> new RestaurantNotFoundException("No restaurant found with email: " + email));

        // Authenticate the old password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, oldPassword)
        );

        // Set and encode the new password
        restaurant.setRestaurantPassword(passwordEncoder.encode(newPassword));
        restaurantRepository.save(restaurant);

        log.info("Password updated successfully for email: {}", email);
    }

}
