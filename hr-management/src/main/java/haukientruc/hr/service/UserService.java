package haukientruc.hr.service;

import haukientruc.hr.entity.*;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final haukientruc.hr.repository.RoleRepository roleRepository;
    private final haukientruc.hr.repository.FacultyRepository facultyRepository;
    private final haukientruc.hr.repository.DepartmentRepository departmentRepository;
    private final haukientruc.hr.repository.PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;
    private final LuceneService luceneService;

    // ===== LOGIN =====
    public User login(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sai tài khoản"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Sai mật khẩu");
        }
        return user;
    }

    // ===== REGISTER =====
    public User register(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setCreatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        luceneService.indexUser(saved);
        return saved;
    }

    public User createUser(haukientruc.hr.dto.UserDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Tài khoản đã tồn tại");
        }

        User user = new User();
        mapDtoToEntity(dto, user);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setIsActive(true);
        user.setStatus(true);
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        luceneService.indexUser(saved);
        return saved;
    }

    public User updateUser(Long id, haukientruc.hr.dto.UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        mapDtoToEntity(dto, user);
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);
        luceneService.indexUser(saved);
        return saved;
    }

    private void mapDtoToEntity(haukientruc.hr.dto.UserDTO dto, User user) {
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDob(dto.getDob());
        user.setGender(dto.getGender());
        user.setJoinDate(dto.getJoinDate());
        user.setContractStart(dto.getContractStart());
        user.setContractEnd(dto.getContractEnd());
        user.setCccd(dto.getCccd());
        user.setEthnicity(dto.getEthnicity());
        user.setNationality(dto.getNationality());
        user.setEducationLevel(dto.getEducationLevel());
        user.setWorkingStatus(dto.getWorkingStatus());

        if (dto.getRoleId() != null) {
            user.setRole(roleRepository.findById(dto.getRoleId()).orElse(null));
        } else if (dto.getRoleCode() != null) {
            user.setRole(roleRepository.findAll().stream()
                    .filter(r -> r.getRoleCode().equalsIgnoreCase(dto.getRoleCode()))
                    .findFirst().orElse(null));
        }

        if (dto.getFacultyId() != null) {
            user.setFaculty(facultyRepository.findById(dto.getFacultyId()).orElse(null));
        }
        if (dto.getDepartmentId() != null) {
            user.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        }
        if (dto.getPositionId() != null) {
            user.setPosition(positionRepository.findById(dto.getPositionId()).orElse(null));
        }
    }

    public haukientruc.hr.dto.UserDTO convertToDto(User user) {
        haukientruc.hr.dto.UserDTO dto = new haukientruc.hr.dto.UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDob(user.getDob());
        dto.setGender(user.getGender());
        dto.setJoinDate(user.getJoinDate());
        dto.setContractStart(user.getContractStart());
        dto.setContractEnd(user.getContractEnd());
        dto.setCccd(user.getCccd());
        dto.setEthnicity(user.getEthnicity());
        dto.setNationality(user.getNationality());
        dto.setEducationLevel(user.getEducationLevel());
        dto.setWorkingStatus(user.getWorkingStatus());
        dto.setStatus(user.getStatus());
        dto.setIsActive(user.getIsActive());

        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getRoleId());
            dto.setRoleCode(user.getRole().getRoleCode());
            dto.setRoleName(user.getRole().getRoleName());
        }
        if (user.getFaculty() != null) {
            dto.setFacultyId(user.getFaculty().getId());
            dto.setFacultyName(user.getFaculty().getName());
        }
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getDepartmentName());
        }
        if (user.getPosition() != null) {
            dto.setPositionId(user.getPosition().getId());
            dto.setPositionName(user.getPosition().getName());
        }
        return dto;
    }

    // ===== ADMIN FUNCTIONS =====
    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
        luceneService.deleteUserIndex(id);
    }

    // ===== EXCEL EXPORT TEMPLATE =====
    public byte[] downloadExcelTemplate() throws java.io.IOException {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            // Sheet 1: Data Entry
            org.apache.poi.ss.usermodel.Sheet sheet1 = workbook.createSheet("Nhập dữ liệu");
            org.apache.poi.ss.usermodel.Row header = sheet1.createRow(0);
            String[] columns = { "Họ tên", "Tên đăng nhập", "Mật khẩu", "Email", "Số điện thoại",
                    "Ngày sinh (yyyy-MM-dd)", "Vai trò (ADMIN/USER/...)", "Mã Khoa/Phòng ban", "Mã Chức vụ" };
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            // Sheet 2: Instructions
            org.apache.poi.ss.usermodel.Sheet sheet2 = workbook.createSheet("Hướng dẫn");
            org.apache.poi.ss.usermodel.Row instrHeader = sheet2.createRow(0);
            instrHeader.createCell(0).setCellValue("Trường dữ liệu");
            instrHeader.createCell(1).setCellValue("Mô tả");

            String[][] instructions = {
                    { "Họ tên", "Nhập đầy đủ họ tên nhân viên" },
                    { "Tên đăng nhập", "Duy nhất trong hệ thống" },
                    { "Mật khẩu", "Ít nhất 6 ký tự" },
                    { "Ngày sinh", "Định dạng yyyy-MM-dd (VD: 1990-01-01)" },
                    { "Vai trò", "Nhập mã vai trò (ADMIN, GIANGVIEN, TRUONGKHOA, ...)" },
                    { "Mã Khoa/Phòng ban", "Lấy mã tương ứng trong quản lý Khoa/Phòng ban" },
                    { "Mã Chức vụ", "Lấy mã tương ứng trong quản lý chức vụ" }
            };

            for (int i = 0; i < instructions.length; i++) {
                org.apache.poi.ss.usermodel.Row row = sheet2.createRow(i + 1);
                row.createCell(0).setCellValue(instructions[i][0]);
                row.createCell(1).setCellValue(instructions[i][1]);
            }

            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    // ===== EXCEL IMPORT =====
    @org.springframework.transaction.annotation.Transactional
    public void importUsersFromExcel(org.springframework.web.multipart.MultipartFile file) throws Exception {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(
                file.getInputStream())) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            java.util.List<User> successfulUsers = new java.util.ArrayList<>();
            java.util.List<String> errors = new java.util.ArrayList<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                org.apache.poi.ss.usermodel.Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                String fullName = getCellValue(row.getCell(0));
                String username = getCellValue(row.getCell(1));

                // Skip truly empty rows or rows without mandatory info
                if (username.isEmpty() && fullName.isEmpty()) {
                    continue;
                }

                try {
                    if (username.isEmpty()) {
                        throw new RuntimeException("Tên đăng nhập không được để trống");
                    }

                    haukientruc.hr.dto.UserDTO dto = new haukientruc.hr.dto.UserDTO();
                    dto.setFullName(fullName);
                    dto.setUsername(username);
                    dto.setPassword(getCellValue(row.getCell(2)));
                    dto.setEmail(getCellValue(row.getCell(3)));
                    dto.setPhone(getCellValue(row.getCell(4)));

                    String dobStr = getCellValue(row.getCell(5));
                    if (!dobStr.isEmpty()) {
                        try {
                            dto.setDob(java.time.LocalDate.parse(dobStr));
                        } catch (java.time.format.DateTimeParseException e) {
                            log.warn("Invalid date format at row {}: {}", i, dobStr);
                            // Optionally try more formats or just skip DOB
                        }
                    }

                    dto.setRoleCode(getCellValue(row.getCell(6)));

                    String unitCode = getCellValue(row.getCell(7));
                    String posCode = getCellValue(row.getCell(8));

                    // Map codes to IDs
                    if (!unitCode.isEmpty()) {
                        facultyRepository.findByCode(unitCode).ifPresent(f -> dto.setFacultyId(f.getId()));
                        departmentRepository.findByDepartmentCode(unitCode)
                                .ifPresent(d -> dto.setDepartmentId(d.getId()));
                    }

                    if (!posCode.isEmpty()) {
                        positionRepository.findByCode(posCode).ifPresent(p -> dto.setPositionId(p.getId()));
                    }

                    // Process creation
                    User saved = createUser(dto);
                    successfulUsers.add(saved);
                } catch (Exception e) {
                    log.error("Error importing row {}: {}", i, e.getMessage());
                    errors.add("Dòng " + (i + 1) + ": " + e.getMessage());
                }
            }

            if (!errors.isEmpty()) {
                throw new RuntimeException("Có lỗi xảy ra khi nhập dữ liệu: \n" + String.join("\n", errors));
            }

            // Re-index is already handled by createUser -> luceneService.indexUser(saved)
            // But if we want it to be even faster, we could modify LuceneService to handle
            // batch.
        }
    }

    private String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    java.time.LocalDateTime ldt = cell.getLocalDateTimeCellValue();
                    return ldt != null ? ldt.toLocalDate().toString() : "";
                }
                // Handle scientific notation for phone numbers etc.
                double val = cell.getNumericCellValue();
                if (val == (long) val) {
                    return String.valueOf((long) val);
                } else {
                    return String.valueOf(val);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }

    public List<User> searchUsers(String query) {
        List<Long> ids = luceneService.searchUsers(query);
        if (ids.isEmpty()) {
            // Nếu query rỗng hoặc không có kết quả từ Lucene,
            // có thể trả về list rỗng hoặc thực hiện tìm kiếm mờ khác
            return java.util.Collections.emptyList();
        }
        return userRepository.findAllById(ids);
    }

    @jakarta.annotation.PostConstruct
    public void reindex() {
        List<User> all = userRepository.findAll();
        for (User u : all) {
            luceneService.indexUser(u);
        }
        log.info("Finished initial indexing of {} users", all.size());
    }
}
