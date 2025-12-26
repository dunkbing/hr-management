package haukientruc.hr.repository;

import haukientruc.hr.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient_UserIdOrderByCreatedAtDesc(Long userId);

    long countByRecipient_UserIdAndReadFalse(Long userId);
}
