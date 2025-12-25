package haukientruc.hr.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionDTO {

    private Long id;
    private String code;
    private String name;
    private String description;

    // Unit info
    private String unitType; // Khoa / Phòng ban
    private Long unitId;
    private String unitName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
