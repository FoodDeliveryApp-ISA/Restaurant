package com.ISA.Restaurant.event.Listener;

import com.ISA.Restaurant.Dto.Event.NotificationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        String destination = "/topic/notifications/" + event.getUserId();
        messagingTemplate.convertAndSend(destination, "New Notification: " + event.getMessage());
        log.info("Notification sent via WebSocket for user {}: {}", event.getUserId(), event.getMessage());
    }
}
