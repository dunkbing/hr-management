package haukientruc.hr.service;

import haukientruc.hr.entity.Employee;
import haukientruc.hr.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    // Lấy danh sách nhân viên
    public List<Employee> getAll() {
        return repo.findAll();
    }

    // Lấy 1 nhân viên theo id
    public Optional<Employee> getById(Long id) {
        return repo.findById(id);
    }

    // Thêm hoặc cập nhật nhân viên
    public Employee save(Employee emp) {
        return repo.save(emp);
    }

    // Xoá nhân viên
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
