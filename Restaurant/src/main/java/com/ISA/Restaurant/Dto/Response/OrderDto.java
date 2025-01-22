package com.ISA.Restaurant.Dto.Response;

import com.ISA.Restaurant.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderDto {

    private String orderId;
    private String restaurantId;
    private List<Double> restaurantLocation;
    private List<Double> customerLocation;
    private List<OrderItemDTO> orderItems;;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private OrderStatus status;
    private Double paymentAmount;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdated;
}
