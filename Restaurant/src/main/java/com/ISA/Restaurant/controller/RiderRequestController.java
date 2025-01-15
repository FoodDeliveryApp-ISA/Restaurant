package com.ISA.Restaurant.controller;

import com.ISA.Restaurant.Dto.Event.RiderRequestDto;
import com.ISA.Restaurant.event.producer.RiderRequestProducer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rider-request")
public class RiderRequestController {

    private final RiderRequestProducer riderRequestProducer;

    public RiderRequestController(RiderRequestProducer riderRequestProducer) {
        this.riderRequestProducer = riderRequestProducer;
    }

    @PostMapping
    public ResponseEntity<String> sendRiderRequest(@RequestBody RiderRequestDto riderRequestDto) {
        // Call RiderRequestProducer to send the request
        riderRequestProducer.sendRiderRequest(riderRequestDto);
        return ResponseEntity.ok("Rider request sent successfully for orderId5: " + riderRequestDto.getOrderId());
    }
}
