#!/bin/bash
set -e

# Init PostgreSQL if needed
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    su postgres -c "initdb -D $PGDATA"
    echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
    echo "local all all trust" >> "$PGDATA/pg_hba.conf"
fi

# Start PostgreSQL
su postgres -c "pg_ctl start -D $PGDATA -l /var/lib/postgresql/pg.log -w"

# Create database if not exists
su postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='hr_management'\"" | grep -q 1 || \
    su postgres -c "psql -c \"CREATE DATABASE hr_management\""
su postgres -c "psql -c \"ALTER USER postgres PASSWORD '12052003'\""

# Start Spring Boot API in background
java -jar /app/app.jar \
    --spring.datasource.url=jdbc:postgresql://localhost:5432/hr_management \
    --spring.datasource.username=postgres \
    --spring.datasource.password=12052003 &

# Start nginx in foreground
nginx -g 'daemon off;'
