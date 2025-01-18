package com.ISA.Restaurant.config;

import com.ISA.Restaurant.service.CustomerLocationWebSocketHandler;

import com.ISA.Restaurant.service.handler.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class StompWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/notification-stomp")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}

@Configuration
@EnableWebSocket
public class RawWebSocketConfig implements WebSocketConfigurer {

    private final NotificationWebSocketHandler notificationWebSocketHandler;

    @Autowired
    public RawWebSocketConfig(NotificationWebSocketHandler notificationWebSocketHandler) {
        this.notificationWebSocketHandler = notificationWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(notificationWebSocketHandler, "/ws/notification-raw")
                .setAllowedOrigins("*");
    }
}



//@Configuration
//@EnableWebSocket
//@EnableWebSocketMessageBroker
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    private final CustomerLocationWebSocketHandler customerLocationWebSocketHandler;
//    private final NotificationWebSocketHandler notificationWebSocketHandler;
//
//    @Autowired
//    public WebSocketConfig(
//            CustomerLocationWebSocketHandler customerLocationWebSocketHandler,
//            NotificationWebSocketHandler notificationWebSocketHandler) {
//        this.customerLocationWebSocketHandler = customerLocationWebSocketHandler;
//        this.notificationWebSocketHandler = notificationWebSocketHandler;
//    }
//
//    @Override
//    public void configureMessageBroker(MessageBrokerRegistry config) {
//        config.enableSimpleBroker("/topic"); // Enable in-memory broker
//        config.setApplicationDestinationPrefixes("/app"); // Prefix for client-to-server messages
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        // Customer-location WebSocket endpoint
//        registry.addHandler(customerLocationWebSocketHandler, "/ws/Customer-location")
//                .setAllowedOrigins("*");
//
//        // Notification WebSocket endpoint
//        registry.addHandler(notificationWebSocketHandler, "/ws/notification")
//                .setAllowedOrigins("*");
////                .setAllowedOriginPatterns("http://localhost:5173", "http://example.com")
////                .withSockJS();
//    }
//}

