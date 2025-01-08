package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Entity.RiderLocation;
import com.ISA.Restaurant.utils.JSONParserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @Autowired
    private WebSocketService webSocketService;

    @KafkaListener(topics = "rider-location-updates", groupId = "locationGroup")
    public void consumeMessage(String message) {
        try {
            System.out.println("Consumed message: " + message);
            RiderLocation customerId = JSONParserUtil.parseLocation(message);
// Process the location update

            webSocketService.sendLocationUpdate(customerId.getCustomerId(),customerId.getLatitude(),customerId.getLongitude());
        } catch (Exception e) {
            System.err.println("Failed to process message: " + message);
            throw e;
        }
    }

}

