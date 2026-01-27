package haukientruc.hr.controller;

import haukientruc.hr.dto.WorkHistoryDTO;
import haukientruc.hr.service.WorkHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-history")
@RequiredArgsConstructor
public class WorkHistoryController {

    private final WorkHistoryService historyService;

    @GetMapping
    public ResponseEntity<List<WorkHistoryDTO>> getAll() {
        return ResponseEntity.ok(historyService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkHistoryDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(historyService.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<WorkHistoryDTO> create(@RequestBody WorkHistoryDTO req) {
        return ResponseEntity.ok(historyService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkHistoryDTO> update(@PathVariable Long id, @RequestBody WorkHistoryDTO req) {
        return ResponseEntity.ok(historyService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        historyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
