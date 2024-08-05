# Используйте образ Maven с JDK 21 для сборки проекта
FROM eclipse-temurin:21-jdk-alpine AS build

# Установите рабочую директорию
WORKDIR /app

# Установите Maven
RUN apk add --no-cache maven

# Копируйте pom.xml и загружайте зависимости
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируйте исходный код
COPY src /app/src

# Сборка приложения
RUN mvn package -DskipTests

# Используйте образ Eclipse Temurin для выполнения приложения
FROM eclipse-temurin:21-jdk-alpine

# Установите рабочую директорию
WORKDIR /app

# Найдите файл JAR в каталоге target и скопируйте его
COPY --from=build /app/target/*.jar app.jar

# Запустите приложение
ENTRYPOINT ["java", "-jar", "app.jar"]

# Expose порт приложения
EXPOSE 8080
