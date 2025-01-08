package com.ISA.Restaurant.config;

import com.ISA.Restaurant.service.CustomerLocationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CustomerLocationWebSocketHandler customerLocationWebSocketHandler;

    @Autowired
    public WebSocketConfig(
                           CustomerLocationWebSocketHandler customerLocationWebSocketHandler) {
        this.customerLocationWebSocketHandler = customerLocationWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        registry.addHandler(customerLocationWebSocketHandler, "/ws/Customer-location").setAllowedOrigins("*");
    }
}