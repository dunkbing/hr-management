package haukientruc.hr.repository;

import haukientruc.hr.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    List<Department> findByParentIsNullOrderByOrderIndexAsc();

    boolean existsByDepartmentCode(String departmentCode);

    java.util.Optional<Department> findByDepartmentCode(String departmentCode);
}
