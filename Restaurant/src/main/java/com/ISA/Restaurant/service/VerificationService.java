//package com.ISA.Restaurant.service;
//
//import com.ISA.Restaurant.Entity.Verification;
//import com.ISA.Restaurant.repo.VerificationRepository;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Random;
//
//@Service
//public class VerificationService {
//    private final VerificationRepository verificationRepository;
//    private final EmailService emailService;
//
//    public VerificationService(VerificationRepository verificationRepository, EmailService emailService) {
//        this.verificationRepository = verificationRepository;
//        this.emailService = emailService;
//    }
//
//    public void generateAndSendVerification(String email, String reason) {
//        String code = String.valueOf(new Random().nextInt(900000) + 100000);
//        Verification verification = new Verification(email, code, reason, LocalDateTime.now().plusMinutes(15));
//        verificationRepository.save(verification);
//
//        emailService.sendEmail(email, "Your Verification Code", "Your code: " + code);
//    }
//
//    public void verifyCode(String email, String code) {
//        Verification verification = verificationRepository.findByEmailAndCode(email, code)
//                .orElseThrow(() -> new RuntimeException("Invalid or expired verification code"));
//        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
//            throw new RuntimeException("Verification code has expired");
//        }
//        verificationRepository.delete(verification);
//    }
//
//    public void resendVerificationCode(String email) {
//        Verification verification = verificationRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Verification not found"));
//        generateAndSendVerification(email, verification.getReason());
//    }
//
//    private String generateVerificationCode() {
//        Random random = new Random();
//        int code = random.nextInt(900000) + 100000;
//        return String.valueOf(code);
//    }
//}
