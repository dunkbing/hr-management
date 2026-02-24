package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "reward_discipline")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardDiscipline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Type type; // REWARD, DISCIPLINE

    @Column(columnDefinition = "TEXT")
    private String reason; // Lý do / Nội dung

    private String decisionNumber; // Số quyết định

    private LocalDate decisionDate; // Ngày quyết định

    private LocalDate effectiveDate; // Ngày hiệu lực

    private String attachmentPath; // Đường dẫn file đính kèm

    private LocalDate createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }

    public enum Type {
        REWARD,
        DISCIPLINE
    }
}
