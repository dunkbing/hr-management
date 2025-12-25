# Tóm Tắt Sửa Lỗi 403 - Cập Nhật Cuối Cùng

## Vấn Đề Chính
Lỗi 403 xảy ra vì Spring Boot redirect đến `/error` endpoint khi login thất bại, và endpoint này bị chặn bởi Spring Security.

## Các Sửa Đổi (5 Fixes)

### 1. SecurityConfig.java - CORS
```java
// Đổi từ wildcard sang URL cụ thể
config.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080"
));
```

### 2. SecurityConfig.java - Xóa UserDetailsService
```java
// Đã xóa dòng này khỏi filter chain
.userDetailsService(userDetailsService)
```

### 3. AuthController.java - Thêm @CrossOrigin
```java
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
```

### 4. SecurityConfig.java - Cho phép /error (QUAN TRỌNG NHẤT)
```java
.requestMatchers("/error").permitAll() // ⭐ FIX CHÍNH
```

### 5. AuthController.java - Xử lý lỗi tốt hơn
```java
// Đổi return type sang ResponseEntity
public ResponseEntity<Map<String, Object>> login(...) {
    try {
        // ... login logic
        return ResponseEntity.ok(Map.of(...));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", true, "message", e.getMessage()));
    }
}
```

## Cách Test

### **BƯỚC 1: KHỞI ĐỘNG LẠI BACKEND (BẮT BUỘC)**
```bash
# Dừng server (Ctrl+C)
# Chạy lại
mvn spring-boot:run
```

### **BƯỚC 2: Test với cURL**
```bash
test-login.bat
```

### **BƯỚC 3: Test từ frontend**
1. Mở `http://localhost:5173`
2. Đăng nhập: `admin` / `123456` / `admin`
3. Kiểm tra console - không còn lỗi 403

## Kết Quả Mong Đợi

### ✅ Đăng nhập thành công:
```json
{
  "token": "eyJhbGc...",
  "username": "admin",
  "role": "admin"
}
```
HTTP Status: **200 OK**

### ✅ Đăng nhập thất bại:
```json
{
  "error": true,
  "message": "Sai mật khẩu"
}
```
HTTP Status: **401 Unauthorized** (không phải 403!)

## Files Đã Sửa
1. [`SecurityConfig.java`](file:///d:/datn/my-project/hr-management/src/main/java/haukientruc/hr/config/SecurityConfig.java) - 3 thay đổi
2. [`AuthController.java`](file:///d:/datn/my-project/hr-management/src/main/java/haukientruc/hr/controller/AuthController.java) - 2 thay đổi

## Nếu Vẫn Lỗi
1. ✅ Backend đã restart chưa?
2. ✅ Xem log console có lỗi gì không?
3. ✅ Kiểm tra Network tab trong DevTools
4. ✅ Xóa cache browser (Ctrl+Shift+Delete)
5. ✅ Database có user `admin` chưa?

Chi tiết đầy đủ: [`403_fix_guide.md`](file:///C:/Users/Administrator/.gemini/antigravity/brain/f9fa8f7e-6006-44d3-ab8e-db7262d8a57c/403_fix_guide.md)
