package haukientruc.hr.controller;

import haukientruc.hr.dto.ReportStatsDTO;
import haukientruc.hr.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin
public class ReportController {

    private final ReportService reportService;
    private final haukientruc.hr.service.UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<ReportStatsDTO> getStats() {
        return ResponseEntity.ok(reportService.getStats(null));
    }

    @GetMapping("/faculty-stats")
    public ResponseEntity<ReportStatsDTO> getFacultyStats() {
        haukientruc.hr.dto.UserDTO currentUser = userService.getCurrentUser();
        Long facultyId = (currentUser != null) ? currentUser.getFacultyId() : null;
        return ResponseEntity.ok(reportService.getStats(facultyId));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        byte[] data = reportService.exportToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao_cao_nhan_su.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
}
