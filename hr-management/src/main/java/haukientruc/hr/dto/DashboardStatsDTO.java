package haukientruc.hr.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalFaculties;
    private long totalDepartments;
    private long totalPositions;

    // Data for charts: Month-Year -> Count
    private List<Map<String, Object>> monthlyGrowth;

    // Recent activities (last 5 added users)
    private List<UserDTO> recentUsers;

    private long pendingProposals;
}
