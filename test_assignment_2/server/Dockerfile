# Этап сборки
FROM maven:3.9.8-amazoncorretto-21-al2023 as builder

# Установите рабочую директорию
WORKDIR /app

# Скопируйте Maven конфигурации и исходный код
COPY pom.xml .
COPY src /app/src

# Соберите проект
RUN mvn clean package

# Этап исполнения
FROM maven:3.9.8-amazoncorretto-21-al2023

# Установите рабочую директорию
WORKDIR /app

# Скопируйте JAR-файл из предыдущего этапа
COPY --from=builder /app/target/final-1.0-SNAPSHOT.jar /app/app.jar

# Откройте порт, на котором работает приложение
EXPOSE 8080

# Запустите приложение
CMD ["java", "-jar", "/app/app.jar"]
