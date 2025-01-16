package com.ISA.Restaurant.Entity;

import com.ISA.Restaurant.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
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

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private RestaurantLocation restaurantLocation;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private CustomerLocation customerLocations;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    @JsonManagedReference // Prevent circular reference
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
                 CustomerLocation customerLocation,
                 String restaurantId,
                 String customerName,
                 String customerAddress,
                 String customerPhone) {
        this.orderId = orderId;
        this.customerLocations = customerLocation;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.customerPhone = customerPhone;
        this.restaurantId = restaurantId;
    }

    public List<Double> getCustomerLocationsList()  {
        if (this.customerLocations != null) {
            return Arrays.asList(this.customerLocations.getLatitude(), this.customerLocations.getLongitude());
        }
        return Collections.emptyList(); // Return an empty list if customerLocations is null
    }


    public List<Double> getRestaurantLocationList() {
        if (this.restaurantLocation != null) {
            return Arrays.asList(this.restaurantLocation.getLatitude(), this.restaurantLocation.getLongitude());
        }
        return Collections.emptyList(); // Return an empty list if restaurantLocation is null
    }
}

