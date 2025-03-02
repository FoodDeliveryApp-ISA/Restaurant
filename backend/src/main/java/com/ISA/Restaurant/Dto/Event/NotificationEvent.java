package com.ISA.Restaurant.Dto.Event;
public class NotificationEvent {

    private final String userId;
    private final String message;

    public NotificationEvent(String userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public String getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }
}
