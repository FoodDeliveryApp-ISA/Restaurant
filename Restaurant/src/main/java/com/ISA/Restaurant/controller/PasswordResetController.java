package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Request.ForgetPasswordDto;
import com.ISA.Restaurant.Dto.Request.ResetPasswordDto;
import com.ISA.Restaurant.service.PasswordResetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody ForgetPasswordDto dto) {
        log.info("Password reset request received for email: {}", dto.getEmail());
        passwordResetService.generateResetToken(dto);
        return ResponseEntity.ok("Password reset email sent successfully.");
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateResetToken(@RequestParam("token") String token) {
        try {
            String email = passwordResetService.validateResetToken(token);
            log.info("Token validated successfully for email: {}", email);
            return ResponseEntity.ok("Token is valid");
        } catch (RuntimeException e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        try {
            passwordResetService.updatePassword(resetPasswordDto.getToken(), resetPasswordDto.getNewPassword());
            return ResponseEntity.ok("Password reset successfully.");
        } catch (RuntimeException e) {
            log.error("Password reset failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to reset password: " + e.getMessage());
        }
    }
}
