package com.ISA.Restaurant.repo;

import com.ISA.Restaurant.Entity.Order;
import com.ISA.Restaurant.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByRestaurantId(String restaurantId);
    List<Order> findByStatusNotIn(List<OrderStatus> orderDelivered);

}
