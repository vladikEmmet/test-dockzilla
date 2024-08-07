# Dockerfile для базы данных
FROM postgres:latest

# Копируем init.sql в специальный каталог
COPY init.sql /docker-entrypoint-initdb.d/
