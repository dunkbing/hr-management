package haukientruc.hr.service;

import haukientruc.hr.entity.User;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User login(String username, String password, String role) {

        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vui lòng chọn vai trò đăng nhập");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        // Chuẩn hóa role (tránh lỗi IN HOA / thường)
        String requestedRole = role.trim().toLowerCase();
        String actualRole = user.getRole().getRoleCode().trim().toLowerCase();

        // Validate role - user must select the correct role for their account
        if (!requestedRole.equals(actualRole)) {
            throw new RuntimeException(
                    "Bạn không có quyền đăng nhập với vai trò '" + requestedRole + "'. " +
                    "Tài khoản này có vai trò: '" + actualRole + "'"
            );
        }

        return user;
    }
}
