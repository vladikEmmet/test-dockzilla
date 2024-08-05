# Используйте официальный образ Nginx
FROM nginx:alpine

# Удалите стандартный конфигурационный файл, если он есть
RUN rm /etc/nginx/conf.d/default.conf

# Копируйте ваш конфигурационный файл Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируйте содержимое вашего приложения в каталог Nginx
COPY . /usr/share/nginx/html

# Expose порт 80
EXPOSE 80
