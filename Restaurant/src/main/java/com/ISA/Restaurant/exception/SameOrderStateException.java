package com.ISA.Restaurant.exception;

public class SameOrderStateException extends RuntimeException {
    public SameOrderStateException(String message) {
        super(message);
    }
}
