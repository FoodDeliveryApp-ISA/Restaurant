package com.ISA.Restaurant.Entity;

import com.ISA.Restaurant.Entity.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "restaurant_location")
public class RestaurantLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}

