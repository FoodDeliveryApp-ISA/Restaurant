package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Request.ChangePasswordDto;
import com.ISA.Restaurant.service.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/restaurants")
public class PasswordController {

    private final AuthenticationService authenticationService;

    public PasswordController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        log.info("Change password request received for email: {}", changePasswordDto.getEmail());

        try {
            authenticationService.changePassword(
                    changePasswordDto.getEmail(),
                    changePasswordDto.getOldPassword(),
                    changePasswordDto.getNewPassword()
            );
            return ResponseEntity.ok("Password changed successfully.");
        } catch (RuntimeException e) {
            log.error("Failed to change password: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to change password: " + e.getMessage());
        }
    }
}
