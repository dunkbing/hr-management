package haukientruc.hr.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignDeanDTO {
    private String staffName;
    private LocalDate fromDate;
}
