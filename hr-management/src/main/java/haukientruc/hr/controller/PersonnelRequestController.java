package haukientruc.hr.controller;

import haukientruc.hr.dto.PersonnelRequestDTO;
import haukientruc.hr.dto.SignatureVerificationResult;
import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.service.DigitalSignatureService;
import haukientruc.hr.service.PersonnelRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personnel-requests")
@RequiredArgsConstructor
@CrossOrigin
public class PersonnelRequestController {

    private final PersonnelRequestService service;
    private final DigitalSignatureService digitalSignatureService;

    @PostMapping
    public ResponseEntity<PersonnelRequestDTO> create(@RequestBody PersonnelRequestDTO dto) {
        return ResponseEntity.ok(service.createRequest(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PersonnelRequestDTO>> getMyRequests() {
        return ResponseEntity.ok(service.getMyRequests(null)); // Service will handle getting current user
    }

    @GetMapping("/pending/faculty-head")
    public ResponseEntity<List<PersonnelRequestDTO>> getPendingForFacultyHead() {
        return ResponseEntity.ok(service.getPendingForFacultyHead());
    }

    @GetMapping("/pending/admin")
    public ResponseEntity<List<PersonnelRequestDTO>> getPendingForAdmin() {
        return ResponseEntity.ok(service.getPendingForAdmin());
    }

    @GetMapping("/pending/principal")
    public ResponseEntity<List<PersonnelRequestDTO>> getPendingForPrincipal() {
        return ResponseEntity.ok(service.getPendingForPrincipal());
    }

    @PostMapping("/{id}/approve-faculty-head")
    public ResponseEntity<Void> approveFacultyHead(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.approveByFacultyHead(id, body.get("note"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/approve-admin")
    public ResponseEntity<Void> approveAdmin(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.approveByAdmin(id, body.get("note"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/approve-principal")
    public ResponseEntity<Void> approvePrincipal(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.approveByPrincipal(id, body.get("note"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String rejectedBy = body.getOrDefault("rejectedBy", "admin");
        service.reject(id, body.get("note"), rejectedBy);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PersonnelRequestDTO>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(service.searchRequests(query));
    }

    @GetMapping("/{id}/signed-pdf")
    public ResponseEntity<byte[]> downloadSignedPdf(@PathVariable Long id) {
        PersonnelRequest request = service.getRequestEntity(id);
        if (request.getSignedPdfData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quyet_dinh_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(request.getSignedPdfData());
    }

    @PostMapping("/verify-signature")
    public ResponseEntity<SignatureVerificationResult> verifySignature(
            @RequestParam("file") MultipartFile file) throws Exception {
        byte[] pdfBytes = file.getBytes();
        SignatureVerificationResult result = digitalSignatureService.verifyPdf(pdfBytes);
        return ResponseEntity.ok(result);
    }
}
