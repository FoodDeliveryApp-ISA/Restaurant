package com.ISA.Restaurant.Dto.Event;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderStatusUpdateDto {
    @JsonProperty
    private String orderId;
    @JsonProperty
    private String status;

    public OrderStatusUpdateDto(String orderId, String status) {
        this.orderId = orderId;
        this.status = status;
    }

    // Getters and setters
}
