package haukientruc.hr.controller;

import haukientruc.hr.entity.User;
import haukientruc.hr.service.AuthService;
import haukientruc.hr.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
public class AuthController {

        private final AuthService authService;
        private final JwtTokenProvider jwtTokenProvider;

        @PostMapping("/login")
        public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> req) {
                try {
                        User user = authService.login(
                                        req.get("username"),
                                        req.get("password"),
                                        req.get("role"));

                        // Normalize role before generating token and returning
                        String normalizedRole = user.getRole().getRoleCode() == null ? ""
                                        : user.getRole().getRoleCode().trim().toLowerCase();

                        // Generate JWT token
                        String token = jwtTokenProvider.generateToken(
                                        user.getUsername(),
                                        normalizedRole);

                        return ResponseEntity.ok(Map.of(
                                        "token", token,
                                        "username", user.getUsername(),
                                        "role", normalizedRole));
                } catch (Exception e) {
                        // Return 401 Unauthorized for login failures
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of(
                                                        "error", true,
                                                        "message", e.getMessage()));
                }
        }

        @PostMapping("/change-password")
        public ResponseEntity<?> changePassword(@RequestBody Map<String, String> req) {
                try {
                        String username = req.get("username");
                        String oldPassword = req.get("oldPassword");
                        String newPassword = req.get("newPassword");

                        if (username == null || oldPassword == null || newPassword == null) {
                                return ResponseEntity.badRequest().body("Thiếu thông tin");
                        }

                        authService.changePassword(username, oldPassword, newPassword);
                        return ResponseEntity.ok("Đổi mật khẩu thành công");
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }
}
