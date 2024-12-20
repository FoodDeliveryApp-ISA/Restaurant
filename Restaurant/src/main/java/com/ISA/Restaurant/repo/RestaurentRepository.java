package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Optional, but recommended for clarity
public interface RestaurentRepository extends JpaRepository<Restaurant, Integer> {
    // You can add custom query methods here if needed
}
