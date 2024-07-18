FROM php:8.0-apache

WORKDIR /var/www/html

COPY . .

EXPOSE 80