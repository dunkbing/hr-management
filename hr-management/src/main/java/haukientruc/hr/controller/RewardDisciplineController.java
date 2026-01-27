package haukientruc.hr.controller;

import haukientruc.hr.dto.RewardDisciplineDTO;
import haukientruc.hr.entity.RewardDiscipline;
import haukientruc.hr.service.RewardDisciplineService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reward-discipline")
@RequiredArgsConstructor
@CrossOrigin
public class RewardDisciplineController {

    private final RewardDisciplineService rewardDisciplineService;

    @GetMapping
    public List<RewardDisciplineDTO> getAll() {
        return rewardDisciplineService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<RewardDisciplineDTO> getByUser(@PathVariable Long userId) {
        return rewardDisciplineService.getByUserId(userId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("userId") Long userId,
            @RequestParam("type") RewardDiscipline.Type type,
            @RequestParam(value = "reason", required = false) String reason,
            @RequestParam(value = "decisionNumber", required = false) String decisionNumber,
            @RequestParam(value = "decisionDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate decisionDate,
            @RequestParam(value = "effectiveDate", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate effectiveDate,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            RewardDisciplineDTO dto = RewardDisciplineDTO.builder()
                    .userId(userId)
                    .type(type)
                    .reason(reason)
                    .decisionNumber(decisionNumber)
                    .decisionDate(decisionDate)
                    .effectiveDate(effectiveDate)
                    .build();

            rewardDisciplineService.create(dto, file);
            return ResponseEntity.ok("Tạo quyết định thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        rewardDisciplineService.delete(id);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = rewardDisciplineService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
