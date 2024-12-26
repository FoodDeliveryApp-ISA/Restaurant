package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.RegisterRequest;
import com.ISA.Restaurant.Dto.LoginRequest;
import com.ISA.Restaurant.Dto.VerifyRestaurantDto;
import com.ISA.Restaurant.Entity.Restaurant;
import com.ISA.Restaurant.repo.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
public class AuthenticationService {

    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    // private final EmailService emailService;

    public AuthenticationService(
            RestaurantRepository restaurantRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
            // EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.restaurantRepository = restaurantRepository;
        this.passwordEncoder = passwordEncoder;
        // this.emailService = emailService;
    }

    public Restaurant signup(RegisterRequest input) {
        Restaurant restaurant = new Restaurant(
                input.getRestaurantName(),
                input.getRestaurantEmail(),
                passwordEncoder.encode(input.getRestaurantPassword()),
                input.getRestaurantAddress(),
                input.getRestaurantPhone(),
                input.getRestaurantCity(),
                input.getRestaurantLocation(),
                true
        );
//        restaurant.setVerificationCode(generateVerificationCode());
//        restaurant.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        restaurant.setEnabled(true);

        // sendVerificationEmail(restaurant); // Email sending commented out

        return restaurantRepository.save(restaurant);
    }

    public Restaurant authenticate(LoginRequest input) {
        log.info("Authenticating user {}", input);
        System.out.println("Attempting to authenticate restaurant with email: " + input.getEmail());
        Restaurant restaurant = restaurantRepository.findByRestaurantEmail(input.getEmail())
                .orElseThrow(() -> {
                    System.err.println("Restaurant with email " + input.getEmail() + " not found.");
                    return new RuntimeException("Restaurant not found");
                });
//
//        if (!restaurant.isEnabled()) {
//            throw new RuntimeException("Account not verified. Please verify your account.");
//        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return restaurant;
    }


//    public void verifyRestaurant(VerifyRestaurantDto input) {
//        Optional<Restaurant> optionalRestaurant = restaurantRepository.findByRestaurantEmail(input.getEmail());
//        if (optionalRestaurant.isPresent()) {
//            Restaurant restaurant = optionalRestaurant.get();
//            if (restaurant.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
//                throw new RuntimeException("Verification code has expired");
//            }
//            if (restaurant.getVerificationCode().equals(input.getVerificationCode())) {
//                restaurant.setEnabled(true);
//                restaurant.setVerificationCode(null);
//                restaurant.setVerificationCodeExpiresAt(null);
//                restaurantRepository.save(restaurant);
//            } else {
//                throw new RuntimeException("Invalid verification code");
//            }
//        } else {
//            throw new RuntimeException("Restaurant not found");
//        }
//    }
//
//    public void resendVerificationCode(String email) {
//        Optional<Restaurant> optionalRestaurant = restaurantRepository.findByRestaurantEmail(email);
//        if (optionalRestaurant.isPresent()) {
//            Restaurant restaurant = optionalRestaurant.get();
//            if (restaurant.isEnabled()) {
//                throw new RuntimeException("Account is already verified");
//            }
//            restaurant.setVerificationCode(generateVerificationCode());
//            restaurant.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
//
//            // sendVerificationEmail(restaurant); // Email sending commented out
//
//            restaurantRepository.save(restaurant);
//        } else {
//            throw new RuntimeException("Restaurant not found");
//        }
//    }

    // private void sendVerificationEmail(Restaurant restaurant) { // Email sending commented out
    //     String subject = "Account Verification";
    //     String verificationCode = "VERIFICATION CODE " + restaurant.getVerificationCode();
    //     String htmlMessage = "<html>"
    //             + "<body style=\"font-family: Arial, sans-serif;\">"
    //             + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
    //             + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
    //             + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
    //             + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
    //             + "<h3 style=\"color: #333;\">Verification Code:</h3>"
    //             + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
    //             + "</div>"
    //             + "</div>"
    //             + "</body>"
    //             + "</html>";

    //     try {
    //         emailService.sendVerificationEmail(restaurant.getRestaurantEmail(), subject, htmlMessage);
    //     } catch (MessagingException e) {
    //         e.printStackTrace();
    //     }
    // }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
