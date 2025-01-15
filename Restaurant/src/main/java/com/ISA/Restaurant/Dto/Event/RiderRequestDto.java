package com.ISA.Restaurant.Dto.Event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiderRequestDto {

    private String orderId;
    private List<Double> restaurantLocation;
    private List<Double> customerLocation;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private Double paymentAmount;
    // Getters and setters
}
