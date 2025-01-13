FROM jitesoft/lighttpd:latest

WORKDIR /var/www/html

COPY . .

EXPOSE 80
