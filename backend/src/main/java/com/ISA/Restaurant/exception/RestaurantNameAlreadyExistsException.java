package com.ISA.Restaurant.exception;

public class RestaurantNameAlreadyExistsException extends RuntimeException {
    public RestaurantNameAlreadyExistsException(String message) {
        super(message);
    }
}
