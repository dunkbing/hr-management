package haukientruc.hr.service;

import haukientruc.hr.dto.PositionDTO;
import haukientruc.hr.dto.PositionRequest;
import haukientruc.hr.entity.*;
import haukientruc.hr.repository.*;
import haukientruc.hr.service.LuceneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepo;
    private final FacultyRepository facultyRepo;
    private final DepartmentRepository departmentRepo;
    private final LuceneService luceneService;

    public List<PositionDTO> getAll() {
        return getAll(null);
    }

    public List<PositionDTO> getAll(String search) {
        List<Position> positions;
        if (search != null && !search.trim().isEmpty()) {
            List<Long> ids = luceneService.searchEntities("position", search, new String[] { "code", "name" });
            positions = positionRepo.findAllById(ids);
        } else {
            positions = positionRepo.findAll();
        }

        return positions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Assuming this is the create method, based on the provided snippet
    public PositionDTO create(PositionRequest req) {
        Position position = new Position();
        validateRequest(req);
        mapRequestToEntity(req, position);
        Position saved = positionRepo.save(position);
        luceneService.indexPosition(saved);
        return convertToDTO(saved);
    }

    public PositionDTO update(Long id, PositionRequest req) {
        Position position = positionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chức danh"));
        validateRequest(req);
        mapRequestToEntity(req, position);
        Position saved = positionRepo.save(position);
        luceneService.indexPosition(saved);
        return convertToDTO(saved);
    }

    public void delete(Long id) {
        positionRepo.deleteById(id);
        luceneService.deleteEntityIndex("position", String.valueOf(id));
    }

    private void validateRequest(PositionRequest req) {
        if (req.getFacultyId() == null && req.getDepartmentId() == null) {
            throw new RuntimeException("Phải chọn khoa hoặc phòng ban");
        }
        if (req.getFacultyId() != null && req.getDepartmentId() != null) {
            throw new RuntimeException("Chỉ được chọn khoa hoặc phòng ban");
        }
    }

    private void mapRequestToEntity(PositionRequest req, Position position) {
        position.setCode(req.getCode());
        position.setName(req.getName());
        position.setDescription(req.getDescription());

        if (req.getFacultyId() != null) {
            Faculty faculty = facultyRepo.findById(req.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
            position.setFaculty(faculty);
            position.setDepartment(null);
        } else if (req.getDepartmentId() != null) {
            Department department = departmentRepo.findById(req.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban"));
            position.setDepartment(department);
            position.setFaculty(null);
        }
    }

    private PositionDTO convertToDTO(Position p) {
        PositionDTO dto = new PositionDTO();
        dto.setId(p.getId());
        dto.setCode(p.getCode());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());

        if (p.getFaculty() != null) {
            dto.setUnitType("Khoa");
            dto.setUnitId(p.getFaculty().getId());
            dto.setUnitName(p.getFaculty().getName());
        } else if (p.getDepartment() != null) {
            dto.setUnitType("Phòng ban");
            dto.setUnitId(p.getDepartment().getId());
            dto.setUnitName(p.getDepartment().getDepartmentName());
        }

        return dto;
    }
}
