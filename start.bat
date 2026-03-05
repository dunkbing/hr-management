@echo off
cd /d "%~dp0"
docker compose up --build -d
echo.
echo Starting HR Management System...
echo.
echo   Frontend:  http://localhost:5173
echo   API:       http://localhost:8080
echo   Database:  PostgreSQL on port 5432
echo.
echo Default users (password: 123456):
echo   superadmin, admin, hieutruong, truongkhoa, giangvien
echo.
echo Run 'docker compose logs -f' to see logs
echo Run 'docker compose down' to stop
echo Run 'docker compose down -v' to stop and reset database
echo.
pause
