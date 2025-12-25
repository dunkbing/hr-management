package haukientruc.hr.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity // đánh dấu đây là entity trong JPA
@Data // tự động sinh getter/setter/toString()
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employee") // tên bảng trong PostgreSQL
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    private Long id;

    @Column(nullable = false, unique = true)
    private String employeeCode; // mã nhân viên (duy nhất)

    @Column(nullable = false)
    private String fullName; // họ tên đầy đủ

    private String department;  // phòng ban
    private String position;    // chức vụ
    private String phone;       // số điện thoại
    private String email;       // email nhân viên
}
