package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Request.RequestVerificationDto;
import com.ISA.Restaurant.Dto.Request.VerifyEmailDto;
import com.ISA.Restaurant.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailVerificationController {
    private final VerificationService verificationService;

    public EmailVerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestVerificationCode(@RequestParam RequestVerificationDto requestVerificationDto) {
        try {
            verificationService.generateAndSendVerification(requestVerificationDto);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyEmailDto verifyEmailDto) {
        try {
            verificationService.verifyCode(verifyEmailDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam RequestVerificationDto requestVerificationDto) {
        try {
            verificationService.resendVerificationCode(requestVerificationDto);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
