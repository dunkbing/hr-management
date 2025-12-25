@echo off
echo ========================================
echo Testing Login Backend API
echo ========================================
echo.

echo Test 1: Login as Admin
echo -----------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"admin\"}"
echo.
echo.

echo Test 2: Login as Hieutruong
echo -----------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"hieutruong\",\"password\":\"123456\",\"role\":\"hieutruong\"}"
echo.
echo.

echo Test 3: Login as Truongkhoa
echo -----------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"truongkhoa\",\"password\":\"123456\",\"role\":\"truongkhoa\"}"
echo.
echo.

echo Test 4: Login with wrong password (should fail)
echo -----------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"wrongpass\",\"role\":\"admin\"}"
echo.
echo.

echo Test 5: Login with wrong role (should fail)
echo -----------------------
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"123456\",\"role\":\"hieutruong\"}"
echo.
echo.

echo ========================================
echo Tests completed!
echo ========================================
pause
