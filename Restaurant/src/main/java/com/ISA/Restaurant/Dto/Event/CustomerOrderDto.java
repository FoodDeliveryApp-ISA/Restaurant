package com.ISA.Restaurant.Dto.Event;

import lombok.Data;

import java.util.List;

@Data
public class CustomerOrderDto {
    private String orderId;
    private String restaurantId;
    private List<Double> customerLocation;
    private String customerName;
    private String customerAddress;
    private String customerPhone;

//    private List<OrderItem> items;

}
