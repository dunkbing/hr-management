package haukientruc.hr.controller;

import haukientruc.hr.entity.Employee;
import haukientruc.hr.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*") // cho phép gọi từ frontend (React/Vue)
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // Lấy danh sách tất cả nhân viên
    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }

    // Lấy nhân viên theo ID
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return service.getById(id).orElse(null);
    }

    // Thêm mới hoặc cập nhật nhân viên
    @PostMapping
    public Employee save(@RequestBody Employee emp) {
        return service.save(emp);
    }

    // Xoá nhân viên
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
