package com.ISA.Restaurant.Entity;

import com.ISA.Restaurant.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    private String orderId;
    @ElementCollection
    private List<Double> restaurantLocation;
    @ElementCollection
    private List<Double> customerLocation;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime createdDate;

    public Order(String orderId,
                 List<Double> customerLocation,
                 String restaurantId,
                 String customerName,
                 String customerAddress,
                 String customerPhone) {
        this.orderId = orderId;
        this.customerLocation = customerLocation;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.customerPhone = customerPhone;

    }

    // Getters, setters, constructors
}
