package haukientruc.hr.controller;

import haukientruc.hr.dto.PersonnelRequestDTO;
import haukientruc.hr.service.PersonnelRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personnel-requests")
@RequiredArgsConstructor
@CrossOrigin
public class PersonnelRequestController {

    private final PersonnelRequestService service;

    @PostMapping
    public ResponseEntity<PersonnelRequestDTO> create(@RequestBody PersonnelRequestDTO dto) {
        return ResponseEntity.ok(service.createRequest(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PersonnelRequestDTO>> getMyRequests() {
        return ResponseEntity.ok(service.getMyRequests(null)); // Service will handle getting current user
    }

    @GetMapping("/pending/admin")
    public ResponseEntity<List<PersonnelRequestDTO>> getPendingForAdmin() {
        return ResponseEntity.ok(service.getPendingForAdmin());
    }

    @GetMapping("/pending/principal")
    public ResponseEntity<List<PersonnelRequestDTO>> getPendingForPrincipal() {
        return ResponseEntity.ok(service.getPendingForPrincipal());
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
        boolean isAdmin = Boolean.parseBoolean(body.get("isAdmin"));
        service.reject(id, body.get("note"), isAdmin);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PersonnelRequestDTO>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(service.searchRequests(query));
    }
}
