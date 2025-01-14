package com.ISA.Restaurant.service;

import com.ISA.Restaurant.Entity.Notification;
import com.ISA.Restaurant.repo.NotificationRepository;
import com.ISA.Restaurant.service.handler.NotificationWebSocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class NotificationService {

    private final NotificationWebSocketHandler notificationWebSocketHandler;
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(
            NotificationWebSocketHandler notificationWebSocketHandler,
            NotificationRepository notificationRepository) {
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.notificationRepository = notificationRepository;
    }

    // Send notification via WebSocket and save to database
    public void sendNotificationToUser(String userId, String message) {
        // Save the notification to the database
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);

        notificationRepository.save(notification);
        log.info("Notification sent to {}", userId);
        log.info("Notification sent to {}", message);
        log.info("Notification {}", notification.toString());
        // Send the notification via WebSocket
        notificationWebSocketHandler.sendNotification(userId, message);
    }

    // Retrieve all notifications for a specific user
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Mark a notification as read
    public void markAsRead(Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setIsRead(true);
            notificationRepository.save(notification);
        } else {
            throw new IllegalArgumentException("Notification with ID " + notificationId + " not found.");
        }
    }

    // Mark all notifications as read for a specific user
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        for (Notification notification : notifications) {
            if (!notification.getIsRead()) {
                notification.setIsRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
        log.info("All notifications for user {} marked as read.", userId);
    }

    @Scheduled(fixedRate = 1800000) // Runs every 30 minutes (1800000 ms)
    public void deleteNotificationsOlderThanTwoHours() {
        LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);
        List<Notification> oldNotifications = notificationRepository.findByCreatedAtBefore(twoHoursAgo);
        if (!oldNotifications.isEmpty()) {
            notificationRepository.deleteAll(oldNotifications);
            log.info("Deleted {} notifications older than 2 hours.", oldNotifications.size());
        } else {
            log.info("No notifications older than 2 hours found.");
        }
    }
}



