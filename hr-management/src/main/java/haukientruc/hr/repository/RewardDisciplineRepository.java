package haukientruc.hr.repository;

import haukientruc.hr.entity.RewardDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardDisciplineRepository extends JpaRepository<RewardDiscipline, Long> {

    @Query("SELECT r FROM RewardDiscipline r WHERE r.user.userId = :userId")
    List<RewardDiscipline> findByUserId(@Param("userId") Long userId);
}
