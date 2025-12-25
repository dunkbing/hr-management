package haukientruc.hr.controller;

import haukientruc.hr.dto.DepartmentRequest;
import haukientruc.hr.dto.DepartmentTreeResponse;
import haukientruc.hr.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/tree")
    public List<DepartmentTreeResponse> getTree() {
        return departmentService.getDepartmentTree();
    }

    @GetMapping
    public List<DepartmentTreeResponse> getAll() {
        return departmentService.getAllDepartments();
    }

    @PostMapping
    public DepartmentTreeResponse create(@RequestBody DepartmentRequest request) {
        return departmentService.createDepartment(request);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable("id") Long id,
            @RequestBody DepartmentRequest request) {
        departmentService.updateDepartment(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        departmentService.deleteDepartment(id);
    }

    @GetMapping("/{id}/staff")
    public List<haukientruc.hr.dto.UserDTO> getStaff(@PathVariable("id") Long id) {
        return departmentService.getStaffByDepartmentId(id);
    }
}
