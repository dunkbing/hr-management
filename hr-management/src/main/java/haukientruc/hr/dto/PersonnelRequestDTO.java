package haukientruc.hr.dto;

import haukientruc.hr.entity.RequestStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PersonnelRequestDTO {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String title;
    private String content;
    private String type;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String facultyHeadNote;
    private String adminNote;
    private String principalNote;
    private String principalSignature;
    private LocalDateTime principalSignatureDate; // Thời gian Hiệu trưởng ký duyệt
}
