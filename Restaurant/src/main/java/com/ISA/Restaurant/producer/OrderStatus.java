package com.ISA.Restaurant.producer;

public enum OrderStatus {
    ORDER_PLACED(1),
    PREPARING(2),
    ASSIGNING_RIDER(3),
    ON_THE_WAY(4),
    ORDER_DELIVERED(5),
    ORDER_CANCELLED(0);

    private final int status;

    OrderStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public static OrderStatus fromValue(String value) {
        return OrderStatus.valueOf(value.toUpperCase());
    }
}
