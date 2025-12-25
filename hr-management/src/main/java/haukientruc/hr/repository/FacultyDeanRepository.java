package haukientruc.hr.repository;

import haukientruc.hr.entity.FacultyDean;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyDeanRepository extends JpaRepository<FacultyDean, Long> {

    Optional<FacultyDean> findByFacultyIdAndIsActiveTrue(Long facultyId);
}
