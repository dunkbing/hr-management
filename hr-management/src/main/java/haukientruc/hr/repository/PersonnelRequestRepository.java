package haukientruc.hr.repository;

import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonnelRequestRepository extends JpaRepository<PersonnelRequest, Long> {
    List<PersonnelRequest> findByRequesterUserId(Long requesterId);

    List<PersonnelRequest> findByStatus(RequestStatus status);
}
