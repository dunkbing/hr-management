package haukientruc.hr.controller;

import haukientruc.hr.entity.User;
import haukientruc.hr.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<haukientruc.hr.dto.UserDTO> getAllUsers() {
        return userService.getAll();
    }

    @GetMapping("/my-faculty")
    public List<haukientruc.hr.dto.UserDTO> getMyFacultyEmployees() {
        return userService.getMyFacultyEmployees();
    }

    @GetMapping("/my-faculty/export")
    public org.springframework.http.ResponseEntity<byte[]> exportMyFacultyEmployees() throws java.io.IOException {
        haukientruc.hr.dto.UserDTO currentUser = userService.getCurrentUser();
        if (currentUser.getFacultyId() == null) {
            throw new RuntimeException("Bạn không thuộc khoa nào");
        }

        byte[] data = userService.exportFacultyEmployees(currentUser.getFacultyId());

        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=ds_nhansu_khoa.xlsx")
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/me")
    public haukientruc.hr.dto.UserDTO getCurrentUser() {
        return userService.getCurrentUser();
    }

    @PostMapping("/avatar")
    public haukientruc.hr.dto.UserDTO uploadAvatar(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        String base64 = java.util.Base64.getEncoder().encodeToString(file.getBytes());
        String avatarData = "data:" + file.getContentType() + ";base64," + base64;

        haukientruc.hr.dto.UserDTO currentUser = userService.getCurrentUser();
        currentUser.setAvatar(avatarData);
        return userService.convertToDto(userService.updateUser(currentUser.getUserId(), currentUser));
    }

    @GetMapping("/{id}")
    public haukientruc.hr.dto.UserDTO getUser(@PathVariable Long id) {
        return userService.convertToDto(userService.getById(id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, java.security.Principal principal) {
        User target = userService.getById(id);
        if (target.getUsername().equals(principal.getName())) {
            throw new RuntimeException("Bạn không thể tự xóa tài khoản của chính mình");
        }
        userService.delete(id);
    }

    @GetMapping("/search")
    public List<haukientruc.hr.dto.UserDTO> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsers(query).stream()
                .map(userService::convertToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping
    public haukientruc.hr.dto.UserDTO createUser(@RequestBody haukientruc.hr.dto.UserDTO dto) {
        return userService.convertToDto(userService.createUser(dto));
    }

    @PutMapping("/{id}")
    public haukientruc.hr.dto.UserDTO updateUser(@PathVariable Long id, @RequestBody haukientruc.hr.dto.UserDTO dto) {
        return userService.convertToDto(userService.updateUser(id, dto));
    }

    @GetMapping("/template")
    public org.springframework.http.ResponseEntity<byte[]> downloadTemplate() throws java.io.IOException {
        byte[] data = userService.downloadExcelTemplate();
        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=user_template.xlsx")
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @PostMapping("/import")
    public org.springframework.http.ResponseEntity<?> importUsers(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            byte[] errorFile = userService.importUsersFromExcel(file);
            if (errorFile != null) {
                return org.springframework.http.ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=import_errors.xlsx")
                        .header("X-Import-Error", "true")
                        .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                        .body(errorFile);
            }
            return org.springframework.http.ResponseEntity.ok("Import thành công");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Import thất bại: " + e.getMessage());
        }
    }
}
