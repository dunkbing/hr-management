package haukientruc.hr.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ContractDTO {
    private Long id;
    private Long userId; // For request/response binding
    private String fullName; // For display
    private String contractCode;
    private String contractType;
    private LocalDate signDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String note;
}
