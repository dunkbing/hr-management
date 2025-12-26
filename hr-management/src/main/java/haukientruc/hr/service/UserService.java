package haukientruc.hr.service;

import haukientruc.hr.entity.*;
import haukientruc.hr.repository.*;
import haukientruc.hr.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
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

    public User createUser(UserDTO dto) {
        checkRoleChangePermission(dto, null);
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

    public User updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        checkRoleChangePermission(dto, user);
        mapDtoToEntity(dto, user);
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);
        luceneService.indexUser(saved);
        return saved;
    }

    private void mapDtoToEntity(UserDTO dto, User user) {
        if (dto.getUsername() != null)
            user.setUsername(dto.getUsername());
        if (dto.getFullName() != null)
            user.setFullName(dto.getFullName());
        if (dto.getEmail() != null)
            user.setEmail(dto.getEmail());
        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());
        if (dto.getDob() != null)
            user.setDob(dto.getDob());
        if (dto.getGender() != null)
            user.setGender(dto.getGender());
        if (dto.getJoinDate() != null)
            user.setJoinDate(dto.getJoinDate());
        if (dto.getContractStart() != null)
            user.setContractStart(dto.getContractStart());
        if (dto.getContractEnd() != null)
            user.setContractEnd(dto.getContractEnd());
        if (dto.getCccd() != null)
            user.setCccd(dto.getCccd());
        if (dto.getEthnicity() != null)
            user.setEthnicity(dto.getEthnicity());
        if (dto.getNationality() != null)
            user.setNationality(dto.getNationality());
        if (dto.getEducationLevel() != null)
            user.setEducationLevel(dto.getEducationLevel());
        if (dto.getWorkingStatus() != null)
            user.setWorkingStatus(dto.getWorkingStatus());
        if (dto.getAvatar() != null)
            user.setAvatar(dto.getAvatar());

        if (dto.getRoleId() != null) {
            user.setRole(roleRepository.findById(dto.getRoleId()).orElse(null));
        } else if (dto.getRoleCode() != null) {
            String roleCode = dto.getRoleCode().trim();
            List<Role> allRoles = roleRepository.findAll();
            user.setRole(allRoles.stream()
                    .filter(r -> {
                        String code = r.getRoleCode();
                        String name = r.getRoleName();
                        return (code != null && (code.equalsIgnoreCase(roleCode) ||
                                code.equalsIgnoreCase("ROLE_" + roleCode) ||
                                ("ROLE_" + code).equalsIgnoreCase(roleCode))) ||
                                (name != null && name.equalsIgnoreCase(roleCode));
                    })
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

    public UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
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
        dto.setAvatar(user.getAvatar());
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
    public UserDTO getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserDTO> getAll() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    public void delete(Long id) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        if (currentUser == null)
            throw new RuntimeException("Chưa đăng nhập");

        // 1. Chặn tự xóa chính mình
        if (currentUser.getUserId().equals(target.getUserId())) {
            throw new RuntimeException("Bạn không thể tự xóa tài khoản của chính mình");
        }

        boolean isSuperAdmin = currentUser.getRole() != null
                && "superadmin".equalsIgnoreCase(currentUser.getRole().getRoleCode());
        String targetRole = target.getRole() != null ? target.getRole().getRoleCode() : "";

        // 2. Chặn xóa SUPER_ADMIN
        if ("superadmin".equalsIgnoreCase(targetRole)) {
            throw new RuntimeException("Không thể xóa tài khoản SUPER_ADMIN");
        }

        // 3. Chặn xóa ADMIN nếu người xóa không phải là SUPER_ADMIN
        if ("admin".equalsIgnoreCase(targetRole) && !isSuperAdmin) {
            throw new RuntimeException("Chỉ SUPER_ADMIN mới có quyền xóa tài khoản ADMIN");
        }

        userRepository.deleteById(id);
        luceneService.deleteEntityIndex("user", String.valueOf(id));
    }

    private void checkRoleChangePermission(UserDTO dto, User existingUser) {
        String currentUsername = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        if (currentUser == null)
            return;

        boolean isCurrentUserSuperAdmin = currentUser.getRole() != null
                && "superadmin".equalsIgnoreCase(currentUser.getRole().getRoleCode());

        // Target role requested in DTO
        String targetRoleCode = dto.getRoleCode();
        String existingRoleCode = (existingUser != null && existingUser.getRole() != null)
                ? existingUser.getRole().getRoleCode()
                : null;

        // 1. Phải là SUPERADMIN mới được sửa tài khoản SUPERADMIN hoặc ADMIN
        if (existingUser != null) {
            String roleToProtect = existingRoleCode != null ? existingRoleCode : "";
            if (("superadmin".equalsIgnoreCase(roleToProtect) || "admin".equalsIgnoreCase(roleToProtect))
                    && !isCurrentUserSuperAdmin) {
                // Ngoại lệ: Cho phép user tự sửa thông tin của chính mình (nếu cần, nhưng
                // thường admin/superadmin tự sửa được)
                // Tuy nhiên theo yêu cầu user, ta cứ chặn admin sửa admin
                if (!currentUser.getUsername().equals(existingUser.getUsername())) {
                    throw new RuntimeException(
                            "Chỉ SUPER_ADMIN mới có quyền chỉnh sửa tài khoản " + roleToProtect.toUpperCase());
                }
            }
        }

        // 2. Kiểm tra nếu có sự thay đổi vai trò hoặc gán vai trò mới
        boolean isRoleChanging = existingUser == null
                || (targetRoleCode != null && !targetRoleCode.equalsIgnoreCase(existingRoleCode));

        if (isRoleChanging) {
            if ("admin".equalsIgnoreCase(targetRoleCode) || "superadmin".equalsIgnoreCase(targetRoleCode)) {
                if (!isCurrentUserSuperAdmin) {
                    throw new RuntimeException("Chỉ SUPER_ADMIN mới có quyền gán vai trò ADMIN hoặc SUPERADMIN");
                }
            }
        }
    }

    // ===== EXCEL EXPORT TEMPLATE =====
    public byte[] downloadExcelTemplate() throws java.io.IOException {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            // Sheet 1: Data Entry
            org.apache.poi.ss.usermodel.Sheet sheet1 = workbook.createSheet("Nhập dữ liệu");
            org.apache.poi.ss.usermodel.Row header = sheet1.createRow(0);

            // Define headers with * for mandatory fields
            String[] columns = {
                    "Họ tên*",
                    "Tên đăng nhập*",
                    "Mật khẩu*",
                    "Email",
                    "Số điện thoại",
                    "Ngày sinh (yyyy-MM-dd)",
                    "Vai trò (Mã)*",
                    "Mã Khoa/Phòng ban",
                    "Mã Chức vụ"
            };

            // Style for header
            org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < columns.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
                sheet1.autoSizeColumn(i);
            }

            // Sheet 2: Instructions
            org.apache.poi.ss.usermodel.Sheet sheet2 = workbook.createSheet("Hướng dẫn");
            org.apache.poi.ss.usermodel.Row instrHeader = sheet2.createRow(0);
            instrHeader.createCell(0).setCellValue("Trường dữ liệu");
            instrHeader.createCell(1).setCellValue("Mô tả");

            String[][] instructions = {
                    { "Họ tên*", "Bắt buộc. Nhập đầy đủ họ tên nhân viên" },
                    { "Tên đăng nhập*", "Bắt buộc. Duy nhất trong hệ thống" },
                    { "Mật khẩu*", "Bắt buộc. Ít nhất 6 ký tự" },
                    { "Ngày sinh", "Định dạng yyyy-MM-dd (VD: 1990-01-01)" },
                    { "Vai trò (Mã)*",
                            "Bắt buộc. Nhập mã vai trò: admin (Quản trị), hieutruong (Hiệu trưởng), truongkhoa (Trưởng khoa), giangvien (Giảng viên)" },
                    { "Mã Khoa/Phòng ban", "Lấy mã tương ứng trong quản lý Khoa/Phòng ban (VD: CNTT, KETOAN, ...)" },
                    { "Mã Chức vụ", "Lấy mã tương ứng trong quản lý chức vụ (VD: TrG, PhG, ...)" }
            };

            for (int i = 0; i < instructions.length; i++) {
                org.apache.poi.ss.usermodel.Row row = sheet2.createRow(i + 1);
                row.createCell(0).setCellValue(instructions[i][0]);
                row.createCell(1).setCellValue(instructions[i][1]);
            }
            sheet2.autoSizeColumn(0);
            sheet2.autoSizeColumn(1);

            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    // ===== EXCEL IMPORT =====
    @Transactional
    public byte[] importUsersFromExcel(MultipartFile file) throws Exception {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(
                file.getInputStream())) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            boolean hasError = false;

            // Header for Error Log
            org.apache.poi.ss.usermodel.Row headerRow = sheet.getRow(0);
            int logColumnIndex = headerRow.getLastCellNum();
            org.apache.poi.ss.usermodel.Cell logHeader = headerRow.createCell(logColumnIndex);
            logHeader.setCellValue("Log lỗi");

            org.apache.poi.ss.usermodel.CellStyle errorStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font errorFont = workbook.createFont();
            errorFont.setColor(org.apache.poi.ss.usermodel.IndexedColors.RED.getIndex());
            errorStyle.setFont(errorFont);
            logHeader.setCellStyle(errorStyle);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                org.apache.poi.ss.usermodel.Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                String fullName = getCellValue(row.getCell(0));
                String username = getCellValue(row.getCell(1));
                String password = getCellValue(row.getCell(2));
                String email = getCellValue(row.getCell(3));
                String phone = getCellValue(row.getCell(4));
                String dobStr = getCellValue(row.getCell(5));
                String roleCode = getCellValue(row.getCell(6));
                String unitCode = getCellValue(row.getCell(7));
                String posCode = getCellValue(row.getCell(8));

                // Skip truly empty rows
                if (username.isEmpty() && fullName.isEmpty() && roleCode.isEmpty()) {
                    continue;
                }

                org.apache.poi.ss.usermodel.Cell logCell = row.createCell(logColumnIndex);
                try {
                    // Mandatory validation
                    java.util.List<String> rowErrors = new java.util.ArrayList<>();
                    if (fullName.isEmpty())
                        rowErrors.add("Họ tên không được trống");
                    if (username.isEmpty())
                        rowErrors.add("Tên đăng nhập không được trống");
                    if (password.isEmpty())
                        rowErrors.add("Mật khẩu không được trống");
                    if (roleCode.isEmpty())
                        rowErrors.add("Vai trò không được trống");

                    if (!rowErrors.isEmpty()) {
                        throw new RuntimeException(String.join(", ", rowErrors));
                    }

                    UserDTO dto = new UserDTO();
                    dto.setFullName(fullName);
                    dto.setUsername(username);
                    dto.setPassword(password);
                    dto.setEmail(email);
                    dto.setPhone(phone);

                    if (!dobStr.isEmpty()) {
                        try {
                            dto.setDob(java.time.LocalDate.parse(dobStr));
                        } catch (java.time.format.DateTimeParseException e) {
                            throw new RuntimeException("Ngày sinh sai định dạng (yyyy-MM-dd)");
                        }
                    }

                    // Map codes to IDs
                    if (!roleCode.isEmpty()) {
                        String finalRoleCode = roleCode.trim();
                        List<Role> allRoles = roleRepository.findAll();
                        Role role = allRoles.stream()
                                .filter(r -> {
                                    String code = r.getRoleCode();
                                    String name = r.getRoleName();
                                    return (code != null && (code.equalsIgnoreCase(finalRoleCode) ||
                                            code.equalsIgnoreCase("ROLE_" + finalRoleCode) ||
                                            ("ROLE_" + code).equalsIgnoreCase(finalRoleCode))) ||
                                            (name != null && name.equalsIgnoreCase(finalRoleCode));
                                })
                                .findFirst()
                                .orElseThrow(() -> {
                                    String validInfo = allRoles.stream()
                                            .map(r -> (r.getRoleCode() != null ? r.getRoleCode() : "") +
                                                    (r.getRoleName() != null ? " (" + r.getRoleName() + ")" : ""))
                                            .collect(java.util.stream.Collectors.joining(", "));
                                    return new RuntimeException("Vai trò '" + finalRoleCode
                                            + "' không tồn tại. Danh sách hợp lệ: " + validInfo);
                                });
                        dto.setRoleCode(role.getRoleCode());
                    }

                    if (!unitCode.isEmpty()) {
                        facultyRepository.findByCode(unitCode).ifPresentOrElse(
                                f -> dto.setFacultyId(f.getId()),
                                () -> departmentRepository.findByDepartmentCode(unitCode)
                                        .ifPresent(d -> dto.setDepartmentId(d.getId())));

                        // Fallback mapping by Name if code didn't match anything
                        if (dto.getFacultyId() == null && dto.getDepartmentId() == null) {
                            facultyRepository.findAll().stream()
                                    .filter(f -> f.getName().equalsIgnoreCase(unitCode))
                                    .findFirst()
                                    .ifPresent(f -> dto.setFacultyId(f.getId()));

                            if (dto.getFacultyId() == null) {
                                departmentRepository.findAll().stream()
                                        .filter(d -> d.getDepartmentName().equalsIgnoreCase(unitCode))
                                        .findFirst()
                                        .ifPresent(d -> dto.setDepartmentId(d.getId()));
                            }
                        }
                    }

                    if (!posCode.isEmpty()) {
                        positionRepository.findByCode(posCode).ifPresentOrElse(
                                p -> dto.setPositionId(p.getId()),
                                () -> positionRepository.findAll().stream()
                                        .filter(p -> p.getName().equalsIgnoreCase(posCode))
                                        .findFirst()
                                        .ifPresent(p -> dto.setPositionId(p.getId())));
                    }

                    // Process creation
                    createUser(dto);
                    logCell.setCellValue("Thành công");
                } catch (Exception e) {
                    hasError = true;
                    // Provide a more user-friendly message for duplicate keys
                    String msg = e.getMessage();
                    if (msg != null && msg.contains("Tài khoản đã tồn tại")) {
                        msg = "Tài khoản '" + username + "' đã tồn tại";
                    } else if (msg == null) {
                        msg = "Lỗi hệ thống không xác định";
                    }
                    logCell.setCellValue(msg);
                    logCell.setCellStyle(errorStyle);
                    log.error("Error importing row {}: {}", i, msg);
                }
            }

            if (hasError) {
                // Return workbook bytes if there are errors
                java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
                workbook.write(out);
                return out.toByteArray();
            }

            return null; // Success, no error log file needed
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
