package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findByEmailAndVerificationCode(String email, String verificationCode);
    Optional<Verification> findByEmail(String email);
}
