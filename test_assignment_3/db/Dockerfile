FROM postgres:latest

COPY init.sql /docker-entrypoint-initdb.d/
COPY pg_hba.conf /var/lib/postgresql/data/pg_hba.conf
