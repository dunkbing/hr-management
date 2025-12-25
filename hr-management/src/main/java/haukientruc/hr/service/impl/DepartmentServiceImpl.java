package haukientruc.hr.service.impl;

import haukientruc.hr.dto.DepartmentRequest;
import haukientruc.hr.dto.DepartmentTreeResponse;
import haukientruc.hr.entity.Department;
import haukientruc.hr.repository.DepartmentRepository;
import haukientruc.hr.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final haukientruc.hr.repository.UserRepository userRepository;

    // =========================
    // 🌳 GET TREE
    // =========================
    @Override
    public List<DepartmentTreeResponse> getDepartmentTree() {

        List<Department> roots = departmentRepository.findByParentIsNullOrderByOrderIndexAsc();

        List<DepartmentTreeResponse> result = new ArrayList<>();
        for (Department d : roots) {
            result.add(mapToTree(d));
        }
        return result;
    }

    // =========================
    // 📋 GET ALL (FLAT)
    // =========================
    @Override
    public List<DepartmentTreeResponse> getAllDepartments() {
        // Lấy tất cả, sắp xếp theo orderIndex (hoặc id)
        List<Department> all = departmentRepository.findAll();

        // Map sang DTO
        List<DepartmentTreeResponse> result = new ArrayList<>();
        for (Department d : all) {
            result.add(mapToDTO(d));
        }
        return result;
    }

    private DepartmentTreeResponse mapToDTO(Department d) {
        DepartmentTreeResponse res = new DepartmentTreeResponse();
        res.setDepartmentId(d.getId());
        res.setDepartmentCode(d.getDepartmentCode());
        res.setDepartmentName(d.getDepartmentName());
        res.setOrderIndex(d.getOrderIndex());
        res.setStatus(d.getStatus());
        if (d.getManager() != null) {
            res.setManagerId(d.getManager().getUserId());
            res.setManagerName(d.getManager().getUsername());
        }
        res.setTotalStaff(userRepository.findByDepartment_Id(d.getId()).size());
        // Flat list không cần children recursive
        return res;
    }

    private DepartmentTreeResponse mapToTree(Department d) {
        DepartmentTreeResponse res = new DepartmentTreeResponse();

        // ✅ SỬA Ở ĐÂY: dùng getId()
        res.setDepartmentId(d.getId());

        res.setDepartmentCode(d.getDepartmentCode());
        res.setDepartmentName(d.getDepartmentName());
        res.setOrderIndex(d.getOrderIndex());
        res.setStatus(d.getStatus());
        if (d.getManager() != null) {
            res.setManagerId(d.getManager().getUserId());
            res.setManagerName(d.getManager().getUsername());
        }
        res.setTotalStaff(userRepository.findByDepartment_Id(d.getId()).size());

        List<DepartmentTreeResponse> children = new ArrayList<>();
        if (d.getChildren() != null) {
            for (Department c : d.getChildren()) {
                children.add(mapToTree(c));
            }
        }
        res.setChildren(children);
        return res;
    }

    // =========================
    // ➕ CREATE
    // =========================
    @Override
    public DepartmentTreeResponse createDepartment(DepartmentRequest request) {

        if (departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new RuntimeException("Mã phòng ban đã tồn tại");
        }

        Department department = new Department();
        department.setDepartmentCode(request.getDepartmentCode());
        department.setDepartmentName(request.getDepartmentName());
        department.setOrderIndex(request.getOrderIndex());
        if (request.getStatus() != null) {
            department.setStatus(request.getStatus());
        }
        if (request.getManagerId() != null) {
            department.setManager(userRepository.findById(request.getManagerId()).orElse(null));
        }

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban cha"));
            department.setParent(parent);
        }

        return mapToDTO(departmentRepository.save(department));
    }

    // =========================
    // ✏️ UPDATE
    // =========================
    @Override
    public void updateDepartment(Long departmentId, DepartmentRequest request) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban"));

        department.setDepartmentCode(request.getDepartmentCode());
        department.setDepartmentName(request.getDepartmentName());
        department.setOrderIndex(request.getOrderIndex());
        if (request.getStatus() != null) {
            department.setStatus(request.getStatus());
        }
        if (request.getManagerId() != null) {
            department.setManager(userRepository.findById(request.getManagerId()).orElse(null));
        } else {
            department.setManager(null);
        }

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng ban cha"));
            department.setParent(parent);
        } else {
            department.setParent(null);
        }

        departmentRepository.save(department);
    }

    // =========================
    // ❌ DELETE
    // =========================
    @Override
    public void deleteDepartment(Long departmentId) {
        departmentRepository.deleteById(departmentId);
    }

    public List<haukientruc.hr.dto.UserDTO> getStaffByDepartmentId(Long departmentId) {
        return userRepository.findByDepartment_Id(departmentId).stream()
                .map(u -> {
                    haukientruc.hr.dto.UserDTO dto = new haukientruc.hr.dto.UserDTO();
                    dto.setUserId(u.getUserId());
                    dto.setUsername(u.getUsername());
                    dto.setRoleId(u.getRole() != null ? u.getRole().getRoleId() : null);
                    dto.setStatus(u.getStatus());
                    return dto;
                }).toList();
    }
}
