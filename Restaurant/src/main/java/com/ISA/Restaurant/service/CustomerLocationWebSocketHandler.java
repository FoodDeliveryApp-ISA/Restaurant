package com.ISA.Restaurant.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;

@Slf4j
@Component
public class CustomerLocationWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketService webSocketService;

    @Autowired
    public CustomerLocationWebSocketHandler(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        log.info("CustomerLocationWebSocketHandler afterConnectionEstablished {}", uri);

        if (uri != null) {
            String query = uri.getQuery();
            if (query != null) {
                String[] params = query.split("&");
                for (String param : params) {
                    String[] keyValue = param.split("=");
                    if (keyValue.length == 2) {
                        String key = keyValue[0];
                        String value = keyValue[1];
                        System.out.println("Key: " + key + ", Value: " + value);
                        webSocketService.registerSession(value, session);
                        System.out.println("New WebSocket connection established for customer: " + value);
                    }
                }
            }
        } else {
            System.out.println("No query parameters found in WebSocket connection.");
        }
    }

    private String getCustomerIdFromSession(WebSocketSession session) {
        return session.getAttributes().get("riderId").toString();
    }
}

