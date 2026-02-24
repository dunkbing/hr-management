@echo off
echo ========================================
echo Starting HR Management Backend...
echo ========================================
echo.
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx384m -Xms128m"
pause
