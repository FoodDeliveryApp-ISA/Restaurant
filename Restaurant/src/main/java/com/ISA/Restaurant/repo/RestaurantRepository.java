package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    Optional<Restaurant> findByRestaurantEmail(String email);
    Optional<Restaurant> findByRestaurantId(Integer id);

    Optional<Restaurant> findByRestaurantName(String restaurantName);



//    Optional<Restaurant> findByVerificationCode(String verificationCode);
}

