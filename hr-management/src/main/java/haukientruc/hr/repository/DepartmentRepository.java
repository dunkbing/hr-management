package haukientruc.hr.repository;

import haukientruc.hr.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    List<Department> findByParentIsNullOrderByOrderIndexAsc();

    boolean existsByDepartmentCode(String departmentCode);

    java.util.Optional<Department> findByDepartmentCode(String departmentCode);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT u.department) FROM User u WHERE u.faculty.id = :facultyId")
    long countDepartmentsByFacultyId(@org.springframework.data.repository.query.Param("facultyId") Long facultyId);
}
