package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    private String fullName;
    private String email;
    private java.time.LocalDate dob;
    private String phone;
    private String gender;
    private java.time.LocalDate joinDate;
    private java.time.LocalDate contractStart;
    private java.time.LocalDate contractEnd;
    private String cccd;
    private String ethnicity;
    private String nationality;
    private String educationLevel;
    private String workingStatus;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

    @Column(columnDefinition = "LONGTEXT")
    private String avatar;

    @Column(columnDefinition = "LONGTEXT")
    private String officialPhoto;

    @Column(columnDefinition = "TEXT")
    private String digitalSignature; // Chữ ký số (base64 image)

    private Boolean status;
    private Boolean isActive;

    private LocalDateTime createdAt;

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Role getRole() {
        return this.role;
    }
}
