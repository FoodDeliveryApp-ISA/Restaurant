package com.ISA.Restaurant.exception;

public class InvalidOrderStateTransitionException extends RuntimeException {
    public InvalidOrderStateTransitionException(String message) {
        super(message);
    }
}
