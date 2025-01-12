package com.ISA.Restaurant.enums;

import java.util.EnumSet;
import java.util.Set;

public enum OrderStatus {
    ORDER_DELIVERED(5),
    ORDER_CANCELLED(0),
    ON_THE_WAY(4),
    ASSIGNING_RIDER(3),
    PREPARING(2),
    ORDER_PLACED(1);

    private final int value;
    private Set<OrderStatus> validTransitions;

    OrderStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public Set<OrderStatus> getValidTransitions() {
        return validTransitions;
    }

    static {
        ORDER_DELIVERED.validTransitions = EnumSet.noneOf(OrderStatus.class);
        ORDER_CANCELLED.validTransitions = EnumSet.noneOf(OrderStatus.class);
        ON_THE_WAY.validTransitions = EnumSet.of(ORDER_DELIVERED, ORDER_CANCELLED);
        ASSIGNING_RIDER.validTransitions = EnumSet.of(ON_THE_WAY, ORDER_CANCELLED);
        PREPARING.validTransitions = EnumSet.of(ASSIGNING_RIDER, ORDER_CANCELLED);
        ORDER_PLACED.validTransitions = EnumSet.of(PREPARING, ORDER_CANCELLED);
    }

    public boolean canTransitionTo(OrderStatus newStatus) {
        return validTransitions.contains(newStatus);
    }
}

