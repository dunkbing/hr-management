#!/bin/sh
cd "$(dirname "$0")"
docker compose up --build -d
echo ""
echo "API is starting at http://localhost:8080"
echo "Database: PostgreSQL on port 5432"
echo ""
echo "Default users (password: 123456):"
echo "  superadmin, admin, hieutruong, truongkhoa, giangvien"
echo ""
echo "Run 'docker compose logs -f api' to see logs"
echo "Run 'docker compose down' to stop"
