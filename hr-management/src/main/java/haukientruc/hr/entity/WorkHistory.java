package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "work_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate eventDate; // Ngày diễn ra sự kiện

    // Loại sự kiện: "TIEP_NHAN", "DIEU_CHUYEN", "BO_NHIEM", "MIEN_NHIEM",
    // "THANG_CHUC", "THAY_DOI_CHUC_DANH"
    private String eventType;

    private String oldPosition;
    private String newPosition;

    private String oldDepartment;
    private String newDepartment;

    @Column(columnDefinition = "TEXT")
    private String description; // Chi tiết quyết định
}
