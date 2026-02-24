package haukientruc.hr;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@Slf4j
public class HrManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrManagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner schemaFix(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				System.out.println("🛠️ Starting system initialization...");

				try {
					jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS official_photo TEXT");
					jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN avatar TYPE TEXT");
					System.out.println("✅ Schema fixed: Columns 'official_photo' and 'avatar' handled");
				} catch (Exception e) {
					System.out.println("ℹ️ Schema already fixed or handled.");
				}

				// Seed default roles (matching frontend codes)
				String[] roles = { "superadmin", "admin", "hieu_truong", "truong_don_vi", "nhan_su" };
				String[] roleNames = { "Quản trị tối cao", "Quản trị hệ thống", "Hiệu trưởng", "Trưởng khoa",
						"Giảng viên" };

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

				// Seed Default Positions (Vietnamese only)
				String[][] positions = {
						{ "TRUONG_KHOA", "Trưởng khoa" },
						{ "PHO_KHOA", "Phó khoa" },
						{ "GIANG_VIEN", "Giảng viên" },
						{ "TRUONG_BO_MON", "Trưởng bộ môn" },
						{ "GIAO_SU", "Giáo sư" },
						{ "PHO_GIAO_SU", "Phó giáo sư" },
						{ "TIEN_SI", "Tiến sĩ" },
						{ "THAC_SI", "Thạc sĩ" },
						{ "TRO_LY_GIANG_DAY", "Trợ lý giảng dạy" },
						{ "NGHIEN_CUU_VIEN", "Nghiên cứu viên" }
				};
				for (String[] pos : positions) {
					try {
						jdbcTemplate.execute(String.format(
								"INSERT INTO positions (code, name, created_at, updated_at) " +
										"SELECT '%s', '%s', NOW(), NOW() " +
										"WHERE NOT EXISTS (SELECT 1 FROM positions WHERE code = '%s')",
								pos[0], pos[1], pos[0]));
						System.out.println("✅ Position seeded: " + pos[1]);
					} catch (Exception e) {
						System.err.println("❌ Error seeding position " + pos[0] + ": " + e.getMessage());
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
						Long roleId = jdbcTemplate.queryForObject(
								"SELECT role_id FROM roles WHERE role_code = ?", Long.class, user[1]);
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
								Long facultyId = jdbcTemplate.queryForObject(
										"SELECT id FROM faculties WHERE code = 'CNTT'", Long.class);
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

				// Fix for existing users: Update khoacntt to be Faculty Head of CNTT
				try {
					// Check if khoacntt user exists
					Integer khoacnttCount = jdbcTemplate.queryForObject(
							"SELECT COUNT(*) FROM users WHERE username = 'khoacntt'", Integer.class);

					if (khoacnttCount != null && khoacnttCount > 0) {
						Long truongDonViRoleId = jdbcTemplate.queryForObject(
								"SELECT role_id FROM roles WHERE role_code = 'truong_don_vi'", Long.class);
						Long cnttFacultyId = jdbcTemplate.queryForObject(
								"SELECT id FROM faculties WHERE code = 'CNTT'", Long.class);

						if (truongDonViRoleId != null && cnttFacultyId != null) {
							jdbcTemplate.update(
									"UPDATE users SET role_id = ?, faculty_id = ? WHERE username = 'khoacntt'",
									truongDonViRoleId, cnttFacultyId);
							System.out
									.println("🔧 Fixed user 'khoacntt': assigned role truong_don_vi and faculty CNTT");
						}
					}
				} catch (Exception e) {
					System.err.println("⚠️ Could not fix khoacntt user: " + e.getMessage());
				}

				System.out.println("🚀 System ready for login!");
			} catch (Throwable t) {
				System.err.println("🚨 CRITICAL: System initialization failed unexpectedly!");
				t.printStackTrace();
			}
		};
	}

	@EventListener
	public void onContextClosed(ContextClosedEvent event) {
		log.info("🛑 Application context is closing. Event: {}", event);
	}
}
