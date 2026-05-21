FROM mysql:8.0

ENV MYSQL_DATABASE=ConstrucaoBancoDeDados
ENV MYSQL_USER=hyper
ENV MYSQL_PASSWORD=1234
ENV MYSQL_ROOT_PASSWORD=root

COPY init.sql /docker-entrypoint-initdb.d/
