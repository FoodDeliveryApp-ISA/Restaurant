package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}