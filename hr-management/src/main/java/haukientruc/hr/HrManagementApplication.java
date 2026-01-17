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

				// Seed Default Faculties
				String[] faculties = { "CNTT", "KIENTRUC", "XAYDUNG" };
				String[] facultyNames = { "Khoa Công nghệ thông tin", "Khoa Kiến trúc", "Khoa Xây dựng" };
				for (int i = 0; i < faculties.length; i++) {
					try {
						jdbcTemplate.execute(String.format(
								"INSERT INTO faculties (code, name, created_at, updated_at, status) " +
										"SELECT '%s', '%s', NOW(), NOW(), 'Active' " +
										"WHERE NOT EXISTS (SELECT 1 FROM faculties WHERE code = '%s')",
								faculties[i], facultyNames[i], faculties[i]));
						System.out.println("✅ Faculty seeded: " + faculties[i]);
					} catch (Exception e) {
						System.err.println("❌ Error seeding faculty " + faculties[i] + ": " + e.getMessage());
					}
				}

				// Seed Default Users
				String[][] users = {
						{ "superadmin", "superadmin" },
						{ "admin", "admin" },
						{ "hieutruong", "hieu_truong" },
						{ "truongkhoa", "truong_don_vi" },
						{ "giangvien", "nhan_su" }
				};

				for (String[] user : users) {
					try {
						Integer roleId = jdbcTemplate.queryForObject(
								"SELECT role_id FROM roles WHERE role_code = ?", Integer.class, user[1]);
						String defaultHash = passwordEncoder.encode("123456");

						if (roleId != null) {
							// Insert if not exists
							jdbcTemplate.execute(String.format(
									"INSERT INTO users (username, password_hash, role_id, is_active, status, created_at) "
											+
											"SELECT '%s', '%s', %d, true, true, NOW() " +
											"WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = '%s')",
									user[0], defaultHash, roleId, user[0]));

							// Force update password and role
							jdbcTemplate.update(
									"UPDATE users SET password_hash = ?, role_id = ? WHERE username = ?",
									defaultHash, roleId, user[0]);

							// Assign Faculty for 'truongkhoa' and 'giangvien' to 'CNTT'
							if (user[0].equals("truongkhoa") || user[0].equals("giangvien")) {
								Integer facultyId = jdbcTemplate.queryForObject(
										"SELECT id FROM faculties WHERE code = 'CNTT'", Integer.class);
								if (facultyId != null) {
									jdbcTemplate.update("UPDATE users SET faculty_id = ? WHERE username = ?", facultyId,
											user[0]);
									System.out.println("🔹 Assigned " + user[0] + " to Faculty CNTT");
								}
							}

							System.out.println("✅ User checked/seeded: " + user[0]);
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
