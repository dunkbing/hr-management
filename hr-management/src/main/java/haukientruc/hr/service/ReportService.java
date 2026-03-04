package haukientruc.hr.service;

import haukientruc.hr.dto.ReportStatsDTO;
import haukientruc.hr.entity.Department;
import haukientruc.hr.entity.Faculty;
import haukientruc.hr.entity.PersonnelRequest;
import haukientruc.hr.entity.User;
import haukientruc.hr.repository.DepartmentRepository;
import haukientruc.hr.repository.FacultyRepository;
import haukientruc.hr.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.BaseFont;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    @PostConstruct
    public void init() {
        log.info("✅ ReportService initialized successfully");
    }

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
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
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
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

    public byte[] exportDepartmentsToExcel() throws IOException {
        List<Department> departments = departmentRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Phòng ban");

            Row headerRow = sheet.createRow(0);
            String[] headers = { "STT", "Mã PB", "Tên phòng ban", "Mô tả", "Số nhân sự", "Trạng thái" };

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Department d : departments) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowIdx - 1);
                row.createCell(1).setCellValue(d.getDepartmentCode());
                row.createCell(2).setCellValue(d.getDepartmentName());
                row.createCell(3).setCellValue(d.getDescription());
                row.createCell(4).setCellValue(userRepository.findByDepartment_Id(d.getId()).size());
                row.createCell(5).setCellValue("ACTIVE".equals(d.getStatus()) ? "Đang hoạt động" : "Đã khóa");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportFacultiesToExcel() throws IOException {
        List<Faculty> faculties = facultyRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách Khoa");

            Row headerRow = sheet.createRow(0);
            String[] headers = { "STT", "Mã Khoa", "Tên Khoa", "Mô tả", "Số nhân sự", "Trạng thái" };

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Faculty f : faculties) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowIdx - 1);
                row.createCell(1).setCellValue(f.getCode() != null ? f.getCode() : "");
                row.createCell(2).setCellValue(f.getName() != null ? f.getName() : "");
                row.createCell(3).setCellValue(f.getDescription() != null ? f.getDescription() : "");
                row.createCell(4).setCellValue(userRepository.findByFaculty_Id(f.getId()).size());
                row.createCell(5).setCellValue("ACTIVE".equals(f.getStatus()) ? "Đang hoạt động" : "Tạm dừng");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportDepartmentsToPdf() {
        List<Department> departments = departmentRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Tiêu đề
            com.lowagie.text.Font titleFont = getVietnameseFont(18, com.lowagie.text.Font.BOLD);
            Paragraph title = new Paragraph("DANH SÁCH PHÒNG BAN", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Khoảng trống

            // Bảng
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 2, 3, 3, 2, 2 });

            String[] headers = { "STT", "Mã PB", "Tên phòng ban", "Mô tả", "Nhân sự", "Trạng thái" };
            com.lowagie.text.Font headFont = getVietnameseFont(12, com.lowagie.text.Font.BOLD);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            com.lowagie.text.Font dataFont = getVietnameseFont(11, com.lowagie.text.Font.NORMAL);
            int stt = 1;
            for (Department d : departments) {
                table.addCell(new Phrase(String.valueOf(stt++), dataFont));
                table.addCell(new Phrase(d.getDepartmentCode(), dataFont));
                table.addCell(new Phrase(d.getDepartmentName(), dataFont));
                table.addCell(new Phrase(d.getDescription() != null ? d.getDescription() : "", dataFont));
                table.addCell(
                        new Phrase(String.valueOf(userRepository.findByDepartment_Id(d.getId()).size()), dataFont));
                table.addCell(new Phrase("ACTIVE".equals(d.getStatus()) ? "Đang hoạt động" : "Đã khóa", dataFont));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating PDF", e);
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public byte[] exportFacultiesToPdf() {
        List<Faculty> faculties = facultyRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Tiêu đề
            com.lowagie.text.Font titleFont = getVietnameseFont(18, com.lowagie.text.Font.BOLD);
            Paragraph title = new Paragraph("DANH SÁCH CÁC KHOA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Bảng
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 2, 3, 3, 2, 2 });

            String[] headers = { "STT", "Mã Khoa", "Tên Khoa", "Mô tả", "Nhân sự", "Trạng thái" };
            com.lowagie.text.Font headFont = getVietnameseFont(12, com.lowagie.text.Font.BOLD);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            com.lowagie.text.Font dataFont = getVietnameseFont(11, com.lowagie.text.Font.NORMAL);
            int stt = 1;
            for (Faculty f : faculties) {
                table.addCell(new Phrase(String.valueOf(stt++), dataFont));
                table.addCell(new Phrase(f.getCode() != null ? f.getCode() : "", dataFont));
                table.addCell(new Phrase(f.getName() != null ? f.getName() : "", dataFont));
                table.addCell(new Phrase(f.getDescription() != null ? f.getDescription() : "", dataFont));
                table.addCell(new Phrase(String.valueOf(userRepository.findByFaculty_Id(f.getId()).size()), dataFont));
                table.addCell(new Phrase("ACTIVE".equals(f.getStatus()) ? "Đang hoạt động" : "Tạm dừng", dataFont));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating Faculty PDF", e);
            throw new RuntimeException("Error generating Faculty PDF", e);
        }
    }

    public byte[] exportUsersToPdf() {
        List<User> users = userRepository.findAll();
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate()); // Landscape
            PdfWriter.getInstance(document, out);
            document.open();

            // Tiêu đề
            com.lowagie.text.Font titleFont = getVietnameseFont(18, com.lowagie.text.Font.BOLD);
            Paragraph title = new Paragraph("DANH SÁCH NHÂN SỰ TOÀN TRƯỜNG", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Bảng
            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 3, 3, 3, 2, 3, 3, 2, 2 });

            String[] headers = { "STT", "Họ tên", "Email", "SĐT", "GT", "Khoa", "Phòng ban", "Chức vụ", "Trạng thái" };
            com.lowagie.text.Font headFont = getVietnameseFont(11, com.lowagie.text.Font.BOLD);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                table.addCell(cell);
            }

            com.lowagie.text.Font dataFont = getVietnameseFont(10, com.lowagie.text.Font.NORMAL);
            int stt = 1;
            for (User u : users) {
                table.addCell(new Phrase(String.valueOf(stt++), dataFont));
                table.addCell(new Phrase(u.getFullName() != null ? u.getFullName() : "", dataFont));
                table.addCell(new Phrase(u.getEmail() != null ? u.getEmail() : "", dataFont));
                table.addCell(new Phrase(u.getPhone() != null ? u.getPhone() : "", dataFont));
                table.addCell(new Phrase(u.getGender() != null ? u.getGender() : "", dataFont));
                table.addCell(new Phrase(u.getFaculty() != null ? u.getFaculty().getName() : "", dataFont));
                table.addCell(
                        new Phrase(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "", dataFont));
                table.addCell(new Phrase(u.getPosition() != null ? u.getPosition().getName() : "", dataFont));
                table.addCell(new Phrase(Boolean.TRUE.equals(u.getIsActive()) ? "Đang làm việc" : "Đã nghỉ", dataFont));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating users PDF", e);
            throw new RuntimeException("Error generating users PDF", e);
        }
    }

    public byte[] exportSummaryToExcel() throws IOException {
        ReportStatsDTO stats = getStats(null);
        List<User> users = userRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Sheet 1: Tổng quan
            Sheet ovSheet = workbook.createSheet("Tổng quan");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] ovHeaders = { "Chỉ số", "Số lượng", "Tỷ lệ" };
            Row ovHeaderRow = ovSheet.createRow(0);
            for (int i = 0; i < ovHeaders.length; i++) {
                Cell cell = ovHeaderRow.createCell(i);
                cell.setCellValue(ovHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            addOvRow(ovSheet, rowIdx++, "Tổng số nhân sự", stats.getTotalEmployees(), 100.0);
            addOvRow(ovSheet, rowIdx++, "Đang làm việc", stats.getActiveEmployees(),
                    (double) stats.getActiveEmployees() / stats.getTotalEmployees() * 100);
            addOvRow(ovSheet, rowIdx++, "Đã nghỉ/Tạm dừng", stats.getInactiveEmployees(),
                    (double) stats.getInactiveEmployees() / stats.getTotalEmployees() * 100);

            ovSheet.autoSizeColumn(0);
            ovSheet.autoSizeColumn(1);
            ovSheet.autoSizeColumn(2);

            // Sheet 2: Theo Khoa
            Sheet facultySheet = workbook.createSheet("Cơ cấu Khoa");
            fillDistributionSheet(facultySheet, "Khoa/Phòng ban", stats.getFacultyDistribution(), headerStyle);

            // Sheet 3: Theo Trình độ
            Sheet eduSheet = workbook.createSheet("Cơ cấu Trình độ");
            fillDistributionSheet(eduSheet, "Trình độ đào tạo", stats.getEducationDistribution(), headerStyle);

            // Sheet 4: Danh sách chi tiết
            Sheet detailSheet = workbook.createSheet("Danh sách chi tiết");
            fillUserDetailSheet(detailSheet, users, headerStyle);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportSummaryToPdf() {
        ReportStatsDTO stats = getStats(null);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = getVietnameseFont(20, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font sectionFont = getVietnameseFont(14, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font normalFont = getVietnameseFont(11, com.lowagie.text.Font.NORMAL);

            Paragraph title = new Paragraph("BÁO CÁO TỔNG HỢP NHÂN SỰ TOÀN TRƯỜNG", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(
                    new Paragraph("Ngày báo cáo: " + new java.text.SimpleDateFormat("dd/MM/yyyy").format(new Date()),
                            normalFont));
            document.add(new Paragraph(" "));

            // 1. Thống kê chung
            document.add(new Paragraph("I. THỐNG KÊ CHUNG", sectionFont));
            document.add(new Paragraph(" - Tổng số nhân sự: " + stats.getTotalEmployees() + " người", normalFont));
            document.add(new Paragraph(" - Đang làm việc: " + stats.getActiveEmployees() + " người", normalFont));
            document.add(new Paragraph(" - Tỷ lệ hoạt động: "
                    + String.format("%.2f", (double) stats.getActiveEmployees() / stats.getTotalEmployees() * 100)
                    + "%",
                    normalFont));
            document.add(new Paragraph(" "));

            // 2. Cơ cấu theo Khoa
            document.add(new Paragraph("II. CƠ CẤU THEO KHOA", sectionFont));
            PdfPTable facultyTable = new PdfPTable(3);
            facultyTable.setWidthPercentage(80);
            facultyTable.setSpacingBefore(10f);
            addTableHeader(facultyTable, new String[] { "STT", "Tên Khoa", "Số lượng" },
                    getVietnameseFont(11, com.lowagie.text.Font.BOLD));

            int stt = 1;
            for (Map<String, Object> item : stats.getFacultyDistribution()) {
                facultyTable.addCell(new Phrase(String.valueOf(stt++), normalFont));
                facultyTable.addCell(new Phrase(item.get("name").toString(), normalFont));
                facultyTable.addCell(new Phrase(item.get("value").toString(), normalFont));
            }
            document.add(facultyTable);
            document.add(new Paragraph(" "));

            // 3. Cơ cấu trình độ
            document.add(new Paragraph("III. CƠ CẤU TRÌNH ĐỘ", sectionFont));
            PdfPTable eduTable = new PdfPTable(3);
            eduTable.setWidthPercentage(80);
            eduTable.setSpacingBefore(10f);
            addTableHeader(eduTable, new String[] { "STT", "Trình độ", "Số lượng" },
                    getVietnameseFont(11, com.lowagie.text.Font.BOLD));

            stt = 1;
            for (Map<String, Object> item : stats.getEducationDistribution()) {
                eduTable.addCell(new Phrase(String.valueOf(stt++), normalFont));
                eduTable.addCell(new Phrase(item.get("name").toString(), normalFont));
                eduTable.addCell(new Phrase(item.get("value").toString(), normalFont));
            }
            document.add(eduTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating summary PDF", e);
            throw new RuntimeException("Error generating summary PDF", e);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private void addOvRow(Sheet sheet, int idx, String label, long value, double percent) {
        Row row = sheet.createRow(idx);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(value);
        row.createCell(2).setCellValue(String.format("%.2f%%", percent));
    }

    private void fillDistributionSheet(Sheet sheet, String label, List<Map<String, Object>> data,
            CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        String[] headers = { "STT", label, "Số lượng" };
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowIdx = 1;
        for (Map<String, Object> item : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(rowIdx - 1);
            row.createCell(1).setCellValue(item.get("name").toString());
            row.createCell(2).setCellValue(Double.parseDouble(item.get("value").toString()));
        }
        sheet.autoSizeColumn(1);
        sheet.autoSizeColumn(2);
    }

    private void fillUserDetailSheet(Sheet sheet, List<User> users, CellStyle headerStyle) {
        String[] headers = { "STT", "Họ tên", "Email", "Số điện thoại", "Khoa", "Phòng ban", "Chức vụ", "Trình độ" };
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowIdx = 1;
        for (User u : users) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(rowIdx - 1);
            row.createCell(1).setCellValue(u.getFullName());
            row.createCell(2).setCellValue(u.getEmail());
            row.createCell(3).setCellValue(u.getPhone());
            row.createCell(4).setCellValue(u.getFaculty() != null ? u.getFaculty().getName() : "");
            row.createCell(5).setCellValue(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "");
            row.createCell(6).setCellValue(u.getPosition() != null ? u.getPosition().getName() : "");
            row.createCell(7).setCellValue(u.getEducationLevel());
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void addTableHeader(PdfPTable table, String[] headers, com.lowagie.text.Font font) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
            table.addCell(cell);
        }
    }

    public byte[] generatePersonnelRequestPdf(PersonnelRequest request) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = getVietnameseFont(18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font sectionFont = getVietnameseFont(14, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font normalFont = getVietnameseFont(12, com.lowagie.text.Font.NORMAL);

            Paragraph title = new Paragraph("QUYET DINH PHE DUYET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Tieu de: " + request.getTitle(), sectionFont));
            document.add(new Paragraph("Loai yeu cau: " + request.getType(), normalFont));
            document.add(new Paragraph("Nguoi yeu cau: " +
                    (request.getRequester().getFullName() != null ? request.getRequester().getFullName()
                            : request.getRequester().getUsername()), normalFont));
            document.add(new Paragraph("Noi dung: " + request.getContent(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Y kien Truong don vi: " +
                    (request.getFacultyHeadNote() != null ? request.getFacultyHeadNote() : ""), normalFont));
            document.add(new Paragraph("Y kien Quan tri vien: " +
                    (request.getAdminNote() != null ? request.getAdminNote() : ""), normalFont));
            document.add(new Paragraph("Y kien Hieu truong: " +
                    (request.getPrincipalNote() != null ? request.getPrincipalNote() : ""), normalFont));
            document.add(new Paragraph(" "));

            if (request.getPrincipalSignatureDate() != null) {
                document.add(new Paragraph("Ngay ky: " +
                        request.getPrincipalSignatureDate().format(
                                java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                        normalFont));
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating personnel request PDF", e);
            throw new RuntimeException("Error generating personnel request PDF", e);
        }
    }

    private com.lowagie.text.Font getVietnameseFont(float size, int style) {
        try {
            // Thử các đường dẫn phổ biến
            String[] fontPaths = {
                    "src/main/resources/fonts/Arial.ttf",
                    "C:\\Windows\\Fonts\\arial.ttf",
                    "C:\\Windows\\Fonts\\times.ttf"
            };

            for (String path : fontPaths) {
                try {
                    java.io.File file = new java.io.File(path);
                    if (file.exists()) {
                        BaseFont bf = BaseFont.createFont(path, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                        return new com.lowagie.text.Font(bf, size, style);
                    }
                } catch (Exception ignored) {
                }
            }

            // Fallback nếu không tìm thấy font nào hỗ trợ Unicode
            log.warn("⚠️ Không tìm thấy font hỗ trợ tiếng Việt, sử dụng font mặc định...");
            return FontFactory.getFont(FontFactory.HELVETICA, size, style);
        } catch (Exception e) {
            return FontFactory.getFont(FontFactory.HELVETICA, size, style);
        }
    }
}
