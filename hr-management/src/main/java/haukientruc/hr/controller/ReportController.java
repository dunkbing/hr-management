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

    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = reportService.exportUsersToPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao_cao_nhan_su.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @GetMapping("/faculties/export")
    public ResponseEntity<byte[]> exportFacultiesExcel() throws IOException {
        byte[] data = reportService.exportFacultiesToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=danh_sach_khoa.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/faculties/export-pdf")
    public ResponseEntity<byte[]> exportFacultiesPdf() {
        byte[] data = reportService.exportFacultiesToPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=danh_sach_khoa.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @GetMapping("/summary/excel")
    public ResponseEntity<byte[]> exportSummaryExcel() throws IOException {
        byte[] data = reportService.exportSummaryToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao_cao_tong_hop.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/summary/pdf")
    public ResponseEntity<byte[]> exportSummaryPdf() {
        byte[] data = reportService.exportSummaryToPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao_cao_tong_hop.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
