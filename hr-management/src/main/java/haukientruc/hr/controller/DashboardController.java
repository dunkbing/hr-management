package haukientruc.hr.controller;

import haukientruc.hr.dto.DashboardStatsDTO;
import haukientruc.hr.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;
    private final haukientruc.hr.service.UserService userService;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/faculty-stats")
    public DashboardStatsDTO getFacultyStats() {
        haukientruc.hr.dto.UserDTO currentUser = userService.getCurrentUser();
        if (currentUser != null && currentUser.getFacultyId() != null) {
            return dashboardService.getFacultyStats(currentUser.getFacultyId());
        }
        return dashboardService.getStats(); // Fallback
    }
}
