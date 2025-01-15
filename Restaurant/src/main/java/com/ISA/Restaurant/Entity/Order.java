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

    private String restaurantId;

    @ElementCollection
    @CollectionTable(name = "restaurant_location", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "coordinate")
    private List<Double> restaurantLocation;

    @ElementCollection
    @CollectionTable(name = "customer_location", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "coordinate")
    private List<Double> customerLocation;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String customerName;
    private String customerAddress;
    private String customerPhone;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Double paymentAmount;

    private LocalDateTime createdDate;
    private LocalDateTime lastUpdated;

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
}

