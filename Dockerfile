# ============ Stage 1: Build Java API ============
FROM maven:3.9-eclipse-temurin-17 AS api-build
WORKDIR /app
COPY hr-management/pom.xml .
RUN mvn dependency:go-offline -B
COPY hr-management/src ./src
RUN mvn package -DskipTests -B

# ============ Stage 2: Build Frontend ============
FROM node:20-alpine AS fe-build
WORKDIR /app
COPY front-end-master/package.json front-end-master/package-lock.json* ./
RUN npm install
COPY front-end-master/ .
# Replace hardcoded localhost:8080 with relative URLs for nginx proxying
RUN find src -type f \( -name '*.jsx' -o -name '*.js' \) \
    -exec sed -i 's|http://localhost:8080||g' {} +
RUN npm run build

# ============ Stage 3: Final all-in-one image ============
FROM alpine:3.20

RUN apk add --no-cache \
    postgresql16 \
    postgresql16-client \
    openjdk17-jre-headless \
    nginx \
    bash

# --- PostgreSQL setup ---
ENV PGDATA=/var/lib/postgresql/data
RUN mkdir -p /var/lib/postgresql /run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /run/postgresql

# --- Copy API JAR ---
WORKDIR /app
COPY --from=api-build /app/target/*.jar app.jar

# --- Copy frontend build ---
COPY --from=fe-build /app/dist /usr/share/nginx/html

# --- nginx config ---
COPY nginx.conf /etc/nginx/http.d/default.conf

# --- Entrypoint script ---
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 80

CMD ["/app/entrypoint.sh"]
