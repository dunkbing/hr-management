package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String contractCode; // Mã hợp đồng

    // Loại hợp đồng: "THU_VIEC", "XAC_DINH_THOI_HAN", "KHONG_XAC_DINH_THOI_HAN"
    private String contractType;

    private LocalDate signDate; // Ngày ký
    private LocalDate startDate; // Ngày bắt đầu
    private LocalDate endDate; // Ngày kết thúc (null nếu không xác định thời hạn)

    private String status; // "ACTIVE", "EXPIRED", "TERMINATED"

    @Column(columnDefinition = "TEXT")
    private String note;
}
