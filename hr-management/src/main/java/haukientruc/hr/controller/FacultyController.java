package haukientruc.hr.controller;

import haukientruc.hr.dto.AssignDeanDTO;
import haukientruc.hr.dto.FacultyDTO;
import haukientruc.hr.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping
    public List<FacultyDTO> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        return facultyService.getAll(search, status);
    }

    @GetMapping("/{id}")
    public FacultyDTO getById(@PathVariable Long id) {
        return facultyService.getById(id);
    }

    @PostMapping
    public FacultyDTO create(@RequestBody FacultyDTO dto) {
        return facultyService.create(dto);
    }

    @PutMapping("/{id}")
    public FacultyDTO update(@PathVariable Long id, @RequestBody FacultyDTO dto) {
        return facultyService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        facultyService.delete(id);
    }

    @GetMapping("/{id}/staff")
    public List<haukientruc.hr.dto.UserDTO> getStaff(@PathVariable Long id) {
        return facultyService.getStaffByFacultyId(id);
    }

    @PutMapping("/{id}/dean")
    public FacultyDTO assignDean(
            @PathVariable Long id,
            @RequestBody AssignDeanDTO dto) {

        return facultyService.assignDean(id, dto);
    }
}
