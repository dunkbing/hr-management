package haukientruc.hr.repository;

import haukientruc.hr.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    java.util.List<User> findByDepartment_Id(Long departmentId);

    java.util.List<User> findByFaculty_Id(Long facultyId);
}
