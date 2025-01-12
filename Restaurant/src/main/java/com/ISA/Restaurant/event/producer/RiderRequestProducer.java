package com.ISA.Restaurant.event.producer;

import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RiderRequestProducer {
    private final KafkaTemplate<String, RiderRequestDto> kafkaTemplate;

    @Value("${kafka.topic.rider-request}")
    private String riderRequestTopic;

    public RiderRequestProducer(KafkaTemplate<String, RiderRequestDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendRiderRequest(RiderRequestDto request) {
        kafkaTemplate.send(riderRequestTopic, request.getOrderId(), request);

    }
}
