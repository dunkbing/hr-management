package haukientruc.hr.service.impl;

import haukientruc.hr.dto.AssignDeanDTO;
import haukientruc.hr.dto.FacultyDTO;
import haukientruc.hr.dto.UserDTO;
import haukientruc.hr.entity.Faculty;
import haukientruc.hr.entity.FacultyDean;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.FacultyDeanRepository;
import haukientruc.hr.repository.FacultyRepository;
import haukientruc.hr.repository.UserRepository;
import haukientruc.hr.service.FacultyService;
import haukientruc.hr.service.LuceneService;
import haukientruc.hr.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

        private final FacultyRepository facultyRepository;
        private final FacultyDeanRepository facultyDeanRepository;
        private final UserRepository userRepository;
        private final LuceneService luceneService;
        private final UserService userService;

        @Override
        public List<FacultyDTO> getAll(String search, String status) {
                List<Faculty> faculties;
                if (search != null && !search.trim().isEmpty()) {
                        List<Long> ids = luceneService.searchEntities("faculty", search,
                                        new String[] { "code", "name" });
                        faculties = facultyRepository.findAllById(ids);
                } else {
                        faculties = facultyRepository.findAll();
                }

                return faculties.stream()
                                .filter(f -> status == null || status.isEmpty() ||
                                                f.getStatus().equals(status))
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public FacultyDTO getById(Long id) {
                Faculty faculty = facultyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
                return toDTO(faculty);
        }

        @Override
        public FacultyDTO create(FacultyDTO dto) {
                Faculty faculty = Faculty.builder()
                                .code(dto.getCode())
                                .name(dto.getName())
                                .description(dto.getDescription())
                                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                                .totalStaff(0)
                                .build();

                if (dto.getManagerId() != null) {
                        User manager = userRepository.findById(dto.getManagerId())
                                        .orElseThrow(() -> new RuntimeException("Không tìm thấy quản lý"));
                        faculty.setManager(manager);
                }

                return toDTO(facultyRepository.save(faculty));
        }

        @Override
        public FacultyDTO update(Long id, FacultyDTO dto) {
                Faculty faculty = facultyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));

                faculty.setName(dto.getName());
                faculty.setCode(dto.getCode());
                faculty.setDescription(dto.getDescription());
                faculty.setStatus(dto.getStatus());

                if (dto.getManagerId() != null) {
                        User manager = userRepository.findById(dto.getManagerId())
                                        .orElseThrow(() -> new RuntimeException("Không tìm thấy quản lý"));
                        faculty.setManager(manager);
                } else {
                        faculty.setManager(null);
                }

                return toDTO(facultyRepository.save(faculty));
        }

        @Override
        public void delete(Long id) {
                if (!facultyRepository.existsById(id)) {
                        throw new RuntimeException("Không tìm thấy khoa");
                }
                facultyRepository.deleteById(id);
                luceneService.deleteEntityIndex("faculty", String.valueOf(id));
        }

        @Override
        public List<UserDTO> getStaffByFacultyId(Long id) {
                return userRepository.findByFaculty_Id(id).stream()
                                .map(userService::convertToDto)
                                .collect(Collectors.toList());
        }

        @Override
        public FacultyDTO assignDean(Long facultyId, AssignDeanDTO dto) {
                Faculty faculty = facultyRepository.findById(facultyId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));

                // Hủy trưởng khoa cũ
                facultyDeanRepository.findByFacultyIdAndIsActiveTrue(facultyId)
                                .ifPresent(oldDean -> {
                                        oldDean.setIsActive(false);
                                        facultyDeanRepository.save(oldDean);
                                });

                // Gán trưởng khoa mới
                FacultyDean newDean = FacultyDean.builder()
                                .faculty(faculty)
                                .staffName(dto.getStaffName())
                                .fromDate(dto.getFromDate())
                                .isActive(true)
                                .build();

                facultyDeanRepository.save(newDean);

                return toDTO(faculty);
        }

        private FacultyDTO toDTO(Faculty faculty) {
                int staffCount = userRepository.findByFaculty_Id(faculty.getId()).size();

                FacultyDTO dto = FacultyDTO.builder()
                                .id(faculty.getId())
                                .code(faculty.getCode())
                                .name(faculty.getName())
                                .description(faculty.getDescription())
                                .status(faculty.getStatus())
                                .totalStaff(staffCount)
                                .managerId(faculty.getManager() != null ? faculty.getManager().getUserId() : null)
                                .build();

                if (faculty.getManager() != null) {
                        dto.setDeanName(faculty.getManager().getUsername());
                } else {
                        // Fallback to FacultyDean history if no manager field set
                        facultyDeanRepository.findByFacultyIdAndIsActiveTrue(faculty.getId())
                                        .ifPresent(d -> {
                                                dto.setDeanName(d.getStaffName());
                                                dto.setDeanFromDate(d.getFromDate().toString());
                                        });
                }

                return dto;
        }
}
