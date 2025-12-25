package haukientruc.hr.repository;

import haukientruc.hr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Có thể thêm custom query nếu cần, ví dụ:
    Employee findByEmployeeCode(String employeeCode);
}
