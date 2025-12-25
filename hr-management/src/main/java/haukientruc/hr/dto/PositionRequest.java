package haukientruc.hr.dto;

import lombok.Data;

@Data
public class PositionRequest {

    private String code;
    private String name;
    private String description;

    // FE gửi 1 trong 2
    private Long facultyId;
    private Long departmentId;
}
