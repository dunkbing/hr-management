# Hướng dẫn Login Backend

## Tổng quan
Backend login đã được triển khai với các tính năng:
- ✅ Xác thực username, password và role
- ✅ Tạo JWT token
- ✅ Trả về token, username và role cho frontend
- ✅ CORS đã được cấu hình
- ✅ Hỗ trợ 4 loại vai trò: admin, hieutruong, truongkhoa, giangvien

## Cấu trúc API

### Endpoint Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456",
  "role": "admin"
}
```

### Response thành công
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "admin"
}
```

### Response lỗi
- **User không tồn tại**: `{"message": "User không tồn tại"}`
- **Sai mật khẩu**: `{"message": "Sai mật khẩu"}`
- **Vai trò không đúng**: `{"message": "Vai trò không đúng"}`

## Tài khoản test

Tất cả tài khoản đều có mật khẩu: **123456**

| Username    | Password | Role        | Dashboard URL              |
|-------------|----------|-------------|----------------------------|
| admin       | 123456   | admin       | /dashboard                 |
| hieutruong  | 123456   | hieutruong  | /principal/dashboard       |
| truongkhoa  | 123456   | truongkhoa  | /faculty/dashboard         |
| giangvien   | 123456   | giangvien   | /lecturer/dashboard        |

## Cách chạy

### 1. Khởi động PostgreSQL
Đảm bảo PostgreSQL đang chạy với database `hr_management`

### 2. Chạy SQL script để tạo dữ liệu test
```bash
psql -U postgres -d hr_management -f src/main/resources/data.sql
```

Hoặc kết nối vào database và chạy script thủ công:
```bash
psql -U postgres -d hr_management
```

Sau đó copy nội dung file `data.sql` và paste vào.

### 3. Khởi động Spring Boot
```bash
cd hr-management
./mvnw spring-boot:run
```

Hoặc trên Windows:
```bash
mvnw.cmd spring-boot:run
```

### 4. Test API bằng curl

**Test login admin:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"admin\"}"
```

**Test login hiệu trưởng:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"hieutruong\",\"password\":\"123456\",\"role\":\"hieutruong\"}"
```

**Test login sai role (sẽ lỗi):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"hieutruong\"}"
```

## Luồng hoạt động

1. **Frontend gửi request** với username, password, role
2. **Backend kiểm tra**:
   - User có tồn tại không?
   - Password có đúng không?
   - Role có khớp với role của user không?
3. **Nếu hợp lệ**:
   - Tạo JWT token chứa username và role
   - Trả về token, username, role
4. **Frontend lưu token** vào localStorage
5. **Frontend chuyển hướng** theo role:
   - admin → /dashboard
   - hieutruong → /principal/dashboard
   - truongkhoa → /faculty/dashboard
   - giangvien → /lecturer/dashboard

## Cấu trúc code

### AuthController.java
- Nhận request login
- Gọi AuthService để xác thực
- Tạo JWT token
- Trả về response

### AuthService.java
- Tìm user theo username
- Kiểm tra password (BCrypt)
- Kiểm tra role
- Trả về user nếu hợp lệ

### JwtTokenProvider.java
- Tạo JWT token với username và role
- Validate token
- Parse token để lấy thông tin

### SecurityConfig.java
- Cấu hình CORS
- Cho phép /api/auth/** không cần authentication
- Các endpoint khác yêu cầu JWT token

## Troubleshooting

### Lỗi "User không tồn tại"
- Kiểm tra database đã có dữ liệu chưa
- Chạy lại script `data.sql`

### Lỗi "Sai mật khẩu"
- Đảm bảo password là "123456"
- Kiểm tra BCrypt hash trong database

### Lỗi "Vai trò không đúng"
- Kiểm tra role gửi lên có khớp với role trong database không
- Các role hợp lệ: admin, hieutruong, truongkhoa, giangvien

### Lỗi CORS
- Đã được cấu hình sẵn trong SecurityConfig
- Cho phép tất cả origins với credentials

### Backend không khởi động
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin kết nối trong application.properties
- Kiểm tra port 8080 có bị chiếm không

## Bảo mật

⚠️ **LƯU Ý**: Đây là môi trường development
- Secret key JWT đang hardcode
- Password test đơn giản (123456)
- CORS cho phép tất cả origins

Khi deploy production cần:
- Đổi secret key thành biến môi trường
- Yêu cầu password mạnh hơn
- Giới hạn CORS origins
- Thêm rate limiting
- Thêm logging và monitoring
