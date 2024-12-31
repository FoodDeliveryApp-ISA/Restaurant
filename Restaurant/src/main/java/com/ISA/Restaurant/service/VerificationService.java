package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Dto.Request.RequestVerificationDto;
import com.ISA.Restaurant.Dto.Request.VerifyEmailDto;
import com.ISA.Restaurant.Entity.Verification;
import com.ISA.Restaurant.repo.VerificationRepository;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VerificationService {
    private final VerificationRepository verificationRepository;
    private final EmailService emailService;

    public VerificationService(VerificationRepository verificationRepository, EmailService emailService) {
        this.verificationRepository = verificationRepository;
        this.emailService = emailService;
    }

    public void generateAndSendVerification(RequestVerificationDto requestVerificationDto) {
        String code = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);

        // Check if a verification record already exists for the email
        Verification existingVerification = verificationRepository.findByEmail(requestVerificationDto.getEmail())
                .orElse(null);

        if (existingVerification != null) {
            // Update the existing record with a new code and expiration date
            existingVerification.setVerificationCode(code);
            existingVerification.setExpiresAt(expiryTime);
            verificationRepository.save(existingVerification);
            sendVerificationEmail(existingVerification);
        } else {
            // Create a new verification record
            Verification newVerification = new Verification(
                    requestVerificationDto.getEmail(),
                    code,
                    expiryTime
            );
            verificationRepository.save(newVerification);
            sendVerificationEmail(newVerification);
        }
    }



    public void verifyCode(VerifyEmailDto verifyEmailDto) {
        Verification verification = verificationRepository.findByEmailAndVerificationCode(
                        verifyEmailDto.getEmail(),
                        verifyEmailDto.getVerificationCode()
                )
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification code"));
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }
        verificationRepository.delete(verification);
    }

    public void resendVerificationCode(RequestVerificationDto requestVerificationDto) {
        Verification verification = verificationRepository.findByEmail(requestVerificationDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Verification not found"));
        generateAndSendVerification(requestVerificationDto);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }


     private void sendVerificationEmail(Verification verification) { // Email sending commented out
         String subject = "Account Verification";
         String verificationCode = "VERIFICATION CODE " + verification.getVerificationCode();
         String htmlMessage = "<html>"
                 + "<body style=\"font-family: Arial, sans-serif;\">"
                 + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                 + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                 + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                 + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                 + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                 + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                 + "</div>"
                 + "</div>"
                 + "</body>"
                 + "</html>";
              try {
                  emailService.sendVerificationEmail(verification.getEmail(), subject, htmlMessage);
              } catch (MessagingException e) {
                  e.printStackTrace();
              }
     }
}
