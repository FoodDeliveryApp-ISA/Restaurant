package com.ISA.Restaurant.config;

import com.ISA.Restaurant.service.CustomerLocationWebSocketHandler;

import com.ISA.Restaurant.service.handler.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CustomerLocationWebSocketHandler customerLocationWebSocketHandler;
    private final NotificationWebSocketHandler notificationWebSocketHandler;

    @Autowired
    public WebSocketConfig(
            CustomerLocationWebSocketHandler customerLocationWebSocketHandler,
            NotificationWebSocketHandler notificationWebSocketHandler) {
        this.customerLocationWebSocketHandler = customerLocationWebSocketHandler;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Customer-location WebSocket endpoint
        registry.addHandler(customerLocationWebSocketHandler, "/ws/Customer-location")
                .setAllowedOrigins("*");

        // Notification WebSocket endpoint
        registry.addHandler(notificationWebSocketHandler, "/ws/notification")
                .setAllowedOriginPatterns("http://localhost:5173", "http://example.com")
                .withSockJS();
    }
}

