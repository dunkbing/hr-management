package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "faculties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    private String status; // ACTIVE / INACTIVE

    @Column(name = "total_staff")
    private Integer totalStaff;

    @OneToMany(mappedBy = "faculty", fetch = FetchType.LAZY)
    private List<FacultyDean> deans;

    @OneToMany(mappedBy = "faculty", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<User> users;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User manager;
}
