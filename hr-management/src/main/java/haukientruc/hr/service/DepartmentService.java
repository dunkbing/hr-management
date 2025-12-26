package haukientruc.hr.service;

import haukientruc.hr.dto.DepartmentRequest;
import haukientruc.hr.dto.DepartmentTreeResponse;

import java.util.List;

public interface DepartmentService {

    List<DepartmentTreeResponse> getDepartmentTree();

    List<DepartmentTreeResponse> getAllDepartments();

    List<DepartmentTreeResponse> getAllDepartments(String search);

    DepartmentTreeResponse createDepartment(DepartmentRequest request);

    void updateDepartment(Long departmentId, DepartmentRequest request);

    void deleteDepartment(Long departmentId);

    List<haukientruc.hr.dto.UserDTO> getStaffByDepartmentId(Long departmentId);
}
