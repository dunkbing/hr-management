package haukientruc.hr.service;

import haukientruc.hr.dto.NotificationDTO;
import haukientruc.hr.entity.Notification;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.NotificationRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipient_UserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipient_UserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipient_UserIdOrderByCreatedAtDesc(userId).stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createNotification(User recipient, String title, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    private NotificationDTO convertToDto(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .createdAt(n.getCreatedAt())
                .read(n.isRead())
                .timeDisplay(formatTime(n.getCreatedAt()))
                .build();
    }

    private String formatTime(LocalDateTime time) {
        if (time == null)
            return "N/A";
        Duration duration = Duration.between(time, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1)
            return "Vừa xong";
        if (minutes < 60)
            return minutes + " phút trước";
        long hours = duration.toHours();
        if (hours < 24)
            return hours + " giờ trước";
        long days = duration.toDays();
        if (days < 7)
            return days + " ngày trước";
        return time.toLocalDate().toString();
    }
}
