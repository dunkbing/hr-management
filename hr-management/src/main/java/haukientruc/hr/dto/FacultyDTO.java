package haukientruc.hr.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyDTO {

    private Long id;
    private String code;
    private String name;
    private String description;
    private String status;
    private Integer totalStaff;
    private Long managerId;

    // Trưởng khoa hiện tại
    private String deanName;
    private String deanFromDate;
}
