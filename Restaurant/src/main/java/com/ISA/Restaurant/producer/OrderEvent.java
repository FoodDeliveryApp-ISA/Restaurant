package com.ISA.Restaurant.producer;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderEvent {
    private String orderId;
    private String restaurantId;
    private String riderId;
    @JsonProperty("orderStatus")
    private OrderStatus status;

    // Constructors, getters, setters, toString...
}
