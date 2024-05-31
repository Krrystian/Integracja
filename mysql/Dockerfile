FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=integracja
ENV MYSQL_USER=integra
ENV MYSQL_PASSWORD=integra

COPY init.sql /docker-entrypoint-initdb.d

EXPOSE 3306


