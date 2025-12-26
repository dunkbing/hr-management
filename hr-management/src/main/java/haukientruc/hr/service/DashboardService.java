package haukientruc.hr.service;

import haukientruc.hr.dto.DashboardStatsDTO;
import haukientruc.hr.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final UserService userService;

    public DashboardStatsDTO getStats() {
        return getDashboardStats(null);
    }

    public DashboardStatsDTO getFacultyStats(Long facultyId) {
        return getDashboardStats(facultyId);
    }

    private DashboardStatsDTO getDashboardStats(Long facultyId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        if (facultyId == null) {
            stats.setTotalUsers(userRepository.count());
            stats.setTotalFaculties(facultyRepository.count());
            stats.setTotalDepartments(departmentRepository.count());
            stats.setTotalPositions(positionRepository.count());
        } else {
            stats.setTotalUsers(userRepository.countByFaculty_Id(facultyId));
            stats.setTotalFaculties(1); // One faculty context
            stats.setTotalDepartments(departmentRepository.countDepartmentsByFacultyId(facultyId));
            stats.setTotalPositions(positionRepository.count()); // Still global positions
        }

        stats.setMonthlyGrowth(calculateMonthlyGrowth(facultyId));
        stats.setPendingProposals(0); // For now, can be linked to a real table if exists

        List<haukientruc.hr.entity.User> usersSnapshot = (facultyId == null)
                ? userRepository.findAll()
                : userRepository.findByFaculty_Id(facultyId);

        stats.setRecentUsers(usersSnapshot.stream()
                .sorted((u1, u2) -> {
                    if (u1.getCreatedAt() == null)
                        return 1;
                    if (u2.getCreatedAt() == null)
                        return -1;
                    return u2.getCreatedAt().compareTo(u1.getCreatedAt());
                })
                .limit(5)
                .map(userService::convertToDto)
                .collect(Collectors.toList()));

        return stats;
    }

    private List<Map<String, Object>> calculateMonthlyGrowth(Long facultyId) {
        List<Map<String, Object>> growth = new ArrayList<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

        List<haukientruc.hr.entity.User> usersForStats = (facultyId == null)
                ? userRepository.findAll()
                : userRepository.findByFaculty_Id(facultyId);

        Map<String, Long> userCounts = usersForStats.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().format(DateTimeFormatter.ofPattern("MM/yyyy")),
                        Collectors.counting()));

        for (int i = 5; i >= 0; i--) {
            LocalDate date = now.minusMonths(i);
            String label = date.format(formatter);
            Map<String, Object> data = new HashMap<>();
            data.put("month", label);
            data.put("count", userCounts.getOrDefault(label, 0L));
            growth.add(data);
        }

        return growth;
    }
}
