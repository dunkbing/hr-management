package haukientruc.hr.controller;

import haukientruc.hr.dto.PositionDTO;
import haukientruc.hr.dto.PositionRequest;
import haukientruc.hr.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public List<PositionDTO> getAll(@RequestParam(required = false) String search) {
        return positionService.getAll(search);
    }

    @PostMapping
    public PositionDTO create(@RequestBody PositionRequest request) {
        return positionService.create(request);
    }

    @PutMapping("/{id}")
    public PositionDTO update(@PathVariable Long id, @RequestBody PositionRequest request) {
        return positionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        positionService.delete(id);
    }
}
