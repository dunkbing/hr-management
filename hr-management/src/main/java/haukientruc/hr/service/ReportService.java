package haukientruc.hr.service;

import haukientruc.hr.dto.ReportStatsDTO;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.FacultyRepository;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;

    public ReportStatsDTO getStats(Long facultyId) {
        List<User> allUsers = (facultyId == null)
                ? userRepository.findAll()
                : userRepository.findByFaculty_Id(facultyId);

        long total = allUsers.size();
        long active = allUsers.stream().filter(u -> Boolean.TRUE.equals(u.getIsActive())).count();

        ReportStatsDTO dto = new ReportStatsDTO();
        dto.setTotalEmployees(total);
        dto.setActiveEmployees(active);
        dto.setInactiveEmployees(total - active);

        dto.setGenderDistribution(aggregate(allUsers, User::getGender));
        dto.setStatusDistribution(aggregate(allUsers, User::getWorkingStatus));
        dto.setEducationDistribution(aggregate(allUsers, User::getEducationLevel));
        dto.setFacultyDistribution(
                aggregate(allUsers, u -> u.getFaculty() != null ? u.getFaculty().getName() : "Khác"));

        return dto;
    }

    private List<Map<String, Object>> aggregate(List<User> users, java.util.function.Function<User, String> mapper) {
        Map<String, Long> counts = users.stream()
                .map(u -> {
                    String val = mapper.apply(u);
                    return val == null ? "Chưa xác định" : val;
                })
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        return counts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    public byte[] exportToExcel() throws IOException {
        List<User> users = userRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Nhân sự");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = { "STT", "Họ tên", "Tên đăng nhập", "Email", "Số điện thoại", "Giới tính", "Khoa",
                    "Phòng ban", "Chức vụ", "Trình độ", "Trạng thái" };

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowIdx - 1);
                row.createCell(1).setCellValue(user.getFullName());
                row.createCell(2).setCellValue(user.getUsername());
                row.createCell(3).setCellValue(user.getEmail());
                row.createCell(4).setCellValue(user.getPhone());
                row.createCell(5).setCellValue(user.getGender());
                row.createCell(6).setCellValue(user.getFaculty() != null ? user.getFaculty().getName() : "");
                row.createCell(7)
                        .setCellValue(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : "");
                row.createCell(8).setCellValue(user.getPosition() != null ? user.getPosition().getName() : "");
                row.createCell(9).setCellValue(user.getEducationLevel());
                row.createCell(10).setCellValue(user.getWorkingStatus());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
