package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Menu;
import com.ISA.Restaurant.Entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByRestaurant(Restaurant restaurant);
    List<Menu> findByRestaurant_RestaurantId(int restaurantId);

    Menu getMenuByMenuId(Long menuId);
}