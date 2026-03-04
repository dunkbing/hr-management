package haukientruc.hr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignatureVerificationResult {
    private boolean valid;
    private String message;
    private String signerName;
    private Date signDate;
    private String reason;
}
