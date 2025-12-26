package haukientruc.hr.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long userId;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private java.time.LocalDate dob;
    private String gender;
    private java.time.LocalDate joinDate;
    private java.time.LocalDate contractStart;
    private java.time.LocalDate contractEnd;
    private String cccd;
    private String ethnicity;
    private String nationality;
    private String educationLevel;
    private String workingStatus;
    private String roleCode;
    private Long roleId;
    private String roleName;
    private Long departmentId;
    private String departmentName;
    private Long facultyId;
    private String facultyName;
    private Long positionId;
    private String positionName;
    private String avatar;
    private Boolean status;
    private Boolean isActive;
}
