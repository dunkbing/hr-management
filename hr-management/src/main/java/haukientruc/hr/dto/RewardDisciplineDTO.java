package haukientruc.hr.dto;

import haukientruc.hr.entity.RewardDiscipline;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RewardDisciplineDTO {
    private Long id;
    private Long userId;
    private String employeeName; // For display
    private RewardDiscipline.Type type;
    private String reason;
    private String decisionNumber;
    private LocalDate decisionDate;
    private LocalDate effectiveDate;
    private String attachmentPath; // Only send name or relative path to client
    private LocalDate createdAt;
}
