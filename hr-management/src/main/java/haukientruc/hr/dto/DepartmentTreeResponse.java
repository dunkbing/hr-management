package haukientruc.hr.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DepartmentTreeResponse {

    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private Integer orderIndex;
    private String status;
    private Long managerId;
    private String managerName;
    private Integer totalStaff;
    private List<DepartmentTreeResponse> children;
}
