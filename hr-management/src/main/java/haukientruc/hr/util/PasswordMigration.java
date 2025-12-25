package haukientruc.hr.util;

import haukientruc.hr.entity.User;
import haukientruc.hr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PasswordMigration implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        for (User user : userRepository.findAll()) {

            String current = user.getPasswordHash();
            if (current == null) continue;

            // Nếu chưa mã hóa BCrypt
            if (!current.startsWith("$2a$")
                    && !current.startsWith("$2b$")
                    && !current.startsWith("$2y$")) {

                String hashed = passwordEncoder.encode(current);
                user.setPasswordHash(hashed);
                userRepository.save(user);
            }
        }
    }
}
