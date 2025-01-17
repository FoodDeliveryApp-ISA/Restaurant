package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.Request.ChangePasswordRequest;
import com.ISA.Restaurant.Dto.Request.ForgotPasswordRequest;
import com.ISA.Restaurant.Dto.Request.RegisterRequest;
import com.ISA.Restaurant.Dto.Request.LoginRequest;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.exception.EmailAlreadyExistsException;
import com.ISA.Restaurant.repo.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

        // Check if email already exists
        if (restaurantRepository.findByRestaurantEmail(input.getRestaurantEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email " + input.getRestaurantEmail() + " is already in use.");
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

    // Change Password Method
    public void changePassword(Integer restaurantId, ChangePasswordRequest request) {
        log.info("Changing password for restaurant with id {}", restaurantId);

        Restaurant restaurant = restaurantRepository.findByRestaurantId(restaurantId)
                .orElseThrow(() -> new UsernameNotFoundException("Restaurant not found"));

        // Verify the old password
        if (!passwordEncoder.matches(request.getOldPassword(), restaurant.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Update with the new password

    }

    // Forgot Password Method (for sending a reset token or process)
//    public void forgotPassword(ForgotPasswordRequest request) {
////        log.info("Handling forgot password for email {}", request.getEmail());
//
//        restaurant.setRestaurantPassword(passwordEncoder.encode(request.getPassword()));
//        restaurantRepository.save(restaurant);
//        log.info("Password updated successfully");
//    }

}
