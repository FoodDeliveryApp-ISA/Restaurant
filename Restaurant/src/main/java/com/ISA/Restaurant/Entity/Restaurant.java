package com.ISA.Restaurant.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "restaurant_id", nullable = false)
    private int restaurantId;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(name = "restaurant_email", nullable = false)
    private String restaurantEmail;

    @Column(name = "restaurant_password", nullable = false)
    private String restaurantPassword;

    @Column(name = "restaurant_address", nullable = false)
    private String restaurantAddress;

    @Column(name = "restaurant_phone", nullable = false)
    private String restaurantPhone;

    @Column(name = "restaurant_city", nullable = false)
    private String restaurantCity;

    @Column(name = "restaurant_location")
    private String restaurantLocation;

    @Column(name = "active")
    private Boolean active;
}
