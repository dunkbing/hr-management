package haukientruc.hr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HrManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrManagementApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner schemaFix(
			org.springframework.jdbc.core.JdbcTemplate jdbcTemplate,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				System.out.println("🛠️ Starting system initialization...");

				try {
					jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN avatar TYPE TEXT");
					System.out.println("✅ Schema fixed: Column 'avatar' changed to TEXT");
				} catch (Exception e) {
					System.out.println("ℹ️ Avatar column already fixed or handled.");
				}

				// Seed default roles (matching frontend codes)
				String[] roles = { "superadmin", "admin", "hieu_truong", "truong_don_vi", "nhan_su" };
				String[] roleNames = { "Super Admin", "System Admin", "Principal", "Faculty Head", "Lecturer/Staff" };

				for (int i = 0; i < roles.length; i++) {
					try {
						jdbcTemplate.execute(String.format(
								"INSERT INTO roles (role_code, role_name) SELECT '%s', '%s' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_code = '%s')",
								roles[i], roleNames[i], roles[i]));
						System.out.println("✅ Role checked/seeded: " + roles[i]);
					} catch (Exception e) {
						System.err.println("❌ Error seeding role " + roles[i] + ": " + e.getMessage());
					}
				}

				// Seed default users (password: 123456)
				String[][] users = {
						{ "superadmin", "superadmin" },
						{ "admin", "admin" },
						{ "hieutruong", "hieu_truong" },
						{ "truongkhoa", "truong_don_vi" },
						{ "giangvien", "nhan_su" }
				};

				for (String[] user : users) {
					try {
						// Ensure role exists before linking
						Integer roleId = jdbcTemplate.queryForObject(
								"SELECT role_id FROM roles WHERE role_code = ?", Integer.class, user[1]);

						String defaultHash = passwordEncoder.encode("123456");

						if (roleId != null) {
							jdbcTemplate.execute(String.format(
									"INSERT INTO users (username, password_hash, role_id, is_active, status, created_at) "
											+
											"SELECT '%s', '%s', "
											+
											"%d, true, true, NOW() " +
											"WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = '%s')",
									user[0], defaultHash, roleId, user[0]));

							// CẬP NHẬT CƯỠNG CHẾ mật khẩu cho user mặc định để đảm bảo login được (dev
							// mode)
							jdbcTemplate.update(
									"UPDATE users SET password_hash = ? WHERE username = ?",
									defaultHash, user[0]);

							System.out.println("✅ User checked/seeded: " + user[0] + " with role " + user[1]);
						}
					} catch (Exception e) {
						System.err.println("❌ Error seeding user " + user[0] + ": " + e.getMessage());
					}
				}

				System.out.println("🚀 System ready for login!");
			} catch (Throwable t) {
				System.err.println("🚨 CRITICAL: System initialization failed unexpectedly!");
				t.printStackTrace();
			}
		};
	}
}
