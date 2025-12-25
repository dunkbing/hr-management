package haukientruc.hr.service;

import haukientruc.hr.dto.PositionDTO;
import haukientruc.hr.dto.PositionRequest;
import haukientruc.hr.entity.*;
import haukientruc.hr.repository.*;
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

    public List<PositionDTO> getAll() {
        return positionRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PositionDTO create(PositionRequest req) {
        validateRequest(req);
        Position position = new Position();
        mapRequestToEntity(req, position);
        return convertToDTO(positionRepo.save(position));
    }

    public PositionDTO update(Long id, PositionRequest req) {
        Position position = positionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chức danh"));
        validateRequest(req);
        mapRequestToEntity(req, position);
        return convertToDTO(positionRepo.save(position));
    }

    public void delete(Long id) {
        positionRepo.deleteById(id);
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
