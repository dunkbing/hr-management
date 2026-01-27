package haukientruc.hr.controller;

import haukientruc.hr.dto.ContractDTO;
import haukientruc.hr.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    public ResponseEntity<List<ContractDTO>> getAll() {
        return ResponseEntity.ok(contractService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContractDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(contractService.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ContractDTO> create(@RequestBody ContractDTO req) {
        return ResponseEntity.ok(contractService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContractDTO> update(@PathVariable Long id, @RequestBody ContractDTO req) {
        return ResponseEntity.ok(contractService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contractService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
