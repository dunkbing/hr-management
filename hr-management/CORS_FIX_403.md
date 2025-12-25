# 403 Forbidden Error - Login Issue Fixed

## Problem Description

When attempting to log in via the frontend, the browser console showed:
```
Failed to load resource: the server responded with a status of 403 ()
:8080/api/auth/login:1
```

This error occurred repeatedly, preventing successful authentication.

## Root Cause

The **403 Forbidden** error was caused by a **CORS (Cross-Origin Resource Sharing) misconfiguration** in `SecurityConfig.java`.

### Technical Details:

In [`SecurityConfig.java`](file:///d:/datn/my-project/hr-management/src/main/java/haukientruc/hr/config/SecurityConfig.java), the CORS configuration had:

```java
config.setAllowedOriginPatterns(List.of("*"));  // ❌ PROBLEM
config.setAllowCredentials(true);
```

**The Issue:** When `allowCredentials` is set to `true`, Spring Security **does not allow** wildcard (`*`) origin patterns for security reasons. This is a CORS specification requirement - credentials cannot be sent to wildcard origins.

## Solution Applied

Changed from `setAllowedOriginPatterns("*")` to `setAllowedOrigins()` with specific localhost URLs:

```java
// ⭐ FIX: Cannot use "*" with allowCredentials=true
config.setAllowedOrigins(List.of(
    "http://localhost:3000",   // React default
    "http://localhost:5173",   // Vite default
    "http://localhost:8080"    // Backend
));
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
config.setAllowedHeaders(List.of("*"));
config.setAllowCredentials(true);
```

## How to Verify the Fix

1. **Restart the backend server** (if it's running):
   - Stop the current Spring Boot application
   - Rebuild and restart it

2. **Test with curl** (from `test-login.bat`):
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"admin\"}"
   ```

3. **Test from frontend**:
   - Open your React/Vite frontend
   - Try logging in with valid credentials
   - Check browser console - the 403 error should be gone

## Expected Behavior After Fix

✅ Login requests should return **200 OK** with a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "admin"
}
```

✅ Browser console should show successful network requests

✅ Users should be redirected to their role-specific dashboards

## Additional Notes

- If your frontend runs on a different port, add it to the `allowedOrigins` list
- For production, replace `localhost` URLs with your actual domain
- Never use wildcard origins in production when credentials are enabled
