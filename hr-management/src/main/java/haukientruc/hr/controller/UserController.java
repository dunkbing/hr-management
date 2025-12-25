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
        return userService.getAll().stream()
                .map(userService::convertToDto)
                .collect(java.util.stream.Collectors.toList());
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
    public org.springframework.http.ResponseEntity<String> importUsers(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            userService.importUsersFromExcel(file);
            return org.springframework.http.ResponseEntity.ok("Import thành công");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Import thất bại: " + e.getMessage());
        }
    }
}
