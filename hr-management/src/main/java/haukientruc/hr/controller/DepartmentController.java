package haukientruc.hr.controller;

import haukientruc.hr.dto.DepartmentRequest;
import haukientruc.hr.dto.DepartmentTreeResponse;
import haukientruc.hr.service.DepartmentService;
import haukientruc.hr.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin
public class DepartmentController {

    private final DepartmentService departmentService;
    private final ReportService reportService;

    @GetMapping("/tree")
    public List<DepartmentTreeResponse> getTree() {
        return departmentService.getDepartmentTree();
    }

    @GetMapping
    public List<DepartmentTreeResponse> getAll(@RequestParam(required = false) String search) {
        return departmentService.getAllDepartments(search);
    }

    @PostMapping
    public DepartmentTreeResponse create(@RequestBody DepartmentRequest request) {
        return departmentService.createDepartment(request);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable("id") Long id,
            @RequestBody DepartmentRequest request) {
        departmentService.updateDepartment(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        departmentService.deleteDepartment(id);
    }

    @GetMapping("/{id}/staff")
    public List<haukientruc.hr.dto.UserDTO> getStaff(@PathVariable("id") Long id) {
        return departmentService.getStaffByDepartmentId(id);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        byte[] data = reportService.exportDepartmentsToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=danh_sach_phong_ban.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = reportService.exportDepartmentsToPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=danh_sach_phong_ban.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
