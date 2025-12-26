package haukientruc.hr.controller;

import haukientruc.hr.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin
public class SystemConfigController {

    private final SystemConfigService service;

    @GetMapping
    public ResponseEntity<Map<String, String>> getAll() {
        return ResponseEntity.ok(service.getAllConfigs());
    }

    @PostMapping
    public ResponseEntity<Void> update(@RequestBody Map<String, String> configs) {
        service.updateConfigs(configs);
        return ResponseEntity.ok().build();
    }
}
