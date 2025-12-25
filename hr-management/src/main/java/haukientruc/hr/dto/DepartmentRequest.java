package haukientruc.hr.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequest {

    private String departmentCode;
    private String departmentName;
    private Integer orderIndex;
    private Long parentId; // null = root
    private String status;
    private Long managerId;
}
