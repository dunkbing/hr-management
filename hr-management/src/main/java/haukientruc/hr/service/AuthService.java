package haukientruc.hr.service;

import haukientruc.hr.entity.User;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public User login(String username, String password, String role) {

                if (role == null || role.isBlank()) {
                        throw new RuntimeException("Vui lòng chọn vai trò đăng nhập");
                }

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

                log.info("Attempting login for user: {}", username);
                if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                        log.warn("Password mismatch for user: {}. Input length: {}, DB Hash length: {}",
                                        username, (password != null ? password.length() : "null"),
                                        (user.getPasswordHash() != null ? user.getPasswordHash().length() : "null"));
                        throw new RuntimeException("Mật khẩu không đúng");
                }

                // Chuẩn hóa role (tránh lỗi IN HOA / thường)
                String requestedRole = role != null ? role.trim().toLowerCase() : "";
                String actualRole = (user.getRole() != null && user.getRole().getRoleCode() != null)
                                ? user.getRole().getRoleCode().trim().toLowerCase()
                                : "";

                log.info("Role validation: requested='{}', actual='{}'", requestedRole, actualRole);

                // Validate role - user must select the correct role for their account
                boolean roleMatches = requestedRole.equals(actualRole) ||
                                (requestedRole.equals("nhan_su") && actualRole.equals("giangvien")) ||
                                (requestedRole.equals("giangvien") && actualRole.equals("nhan_su")) ||
                                (requestedRole.equals("hieu_truong") && actualRole.equals("hieutruong")) ||
                                (requestedRole.equals("hieutruong") && actualRole.equals("hieu_truong")) ||
                                (requestedRole.equals("truong_don_vi") && actualRole.equals("truongkhoa")) ||
                                (requestedRole.equals("truongkhoa") && actualRole.equals("truong_don_vi"));

                if (!roleMatches) {
                        throw new RuntimeException(
                                        "Bạn không có quyền đăng nhập với vai trò '" + requestedRole + "'. " +
                                                        "Tài khoản này có vai trò: '" + actualRole + "'");
                }

                return user;
        }
}
