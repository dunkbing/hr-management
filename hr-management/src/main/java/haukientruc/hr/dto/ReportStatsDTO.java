package haukientruc.hr.dto;

import lombok.*;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportStatsDTO {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;

    private List<Map<String, Object>> genderDistribution; // { name: 'Nam', value: 10 }
    private List<Map<String, Object>> statusDistribution; // { name: 'Đang làm việc', value: 20 }
    private List<Map<String, Object>> educationDistribution; // { name: 'Tiến sĩ', value: 5 }
    private List<Map<String, Object>> facultyDistribution; // { name: 'CNTT', value: 15 }
}
