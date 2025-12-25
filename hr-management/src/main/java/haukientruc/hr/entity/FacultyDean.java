package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "faculty_deans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyDean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @Column(name = "staff_name", nullable = false)
    private String staffName;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "is_active")
    private Boolean isActive;
}
