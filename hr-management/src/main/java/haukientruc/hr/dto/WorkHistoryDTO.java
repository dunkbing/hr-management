package haukientruc.hr.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WorkHistoryDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private LocalDate eventDate;
    private String eventType;
    private String oldPosition;
    private String newPosition;
    private String oldDepartment;
    private String newDepartment;
    private String description;
}
