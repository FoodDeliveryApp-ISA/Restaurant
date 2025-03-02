package com.ISA.Restaurant.enums;

import java.util.EnumSet;
import java.util.Set;

public enum OrderStatus {

    PENDING(1),
    CANCELLED(2),
    PLACED(3),
    PREPARED(4),
    RIDER_ASSIGNED(5),
    RIDER_PICKED(6),
    DELIVERED(7),
    PAID(8);

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

//    public boolean canTransitionTo(OrderStatus newStatus) {
//        return validTransitions.contains(newStatus);
//    }
//
//    // Static block to initialize valid transitions
//    static {
//        CREATED.validTransitions = EnumSet.of(PENDING, CANCELLED);
//        PENDING.validTransitions = EnumSet.of(PLACED, CANCELLED);
//        CANCELLED.validTransitions = EnumSet.noneOf(OrderStatus.class);
//        PLACED.validTransitions = EnumSet.of(PREPARED, CANCELLED);
//        PREPARED.validTransitions = EnumSet.of(RIDER_ASSIGNED, CANCELLED);
//        RIDER_ASSIGNED.validTransitions = EnumSet.of(RIDER_PICKED, CANCELLED);
//        RIDER_PICKED.validTransitions = EnumSet.of(DELIVERED, CANCELLED);
//        DELIVERED.validTransitions = EnumSet.of(PAID);
//        PAID.validTransitions = EnumSet.noneOf(OrderStatus.class);
//    }
}

