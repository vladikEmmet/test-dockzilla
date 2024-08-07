# Проект "Student Management System (SMS)"

Проект представляет собой простую систему для управления студентами в учебном заведении с возможностью добавления, получения и удаения.
Он состоит из трех компонентов: клиентской части (HTML/CSS/JS), серверной части (Java) и базы данных (PostgreSQL).

## Установка и запуск

### 1. Установка Docker

Убедитесь, что на вашей машине установлен Docker. Если нет, установите его с официального сайта Docker: [https://www.docker.com/get-started](https://www.docker.com/get-started)

### 2. Клонирование репозитория

```bash
git clone https://github.com/vladikEmmet/test-dockzilla.git
cd test-dockzilla
cd test_assignment_2
```

### 3. Сборка и запуск проекта

```bash
docker-compose up --build
```

### 4. Доступ к приложению

После успешного запуска, вы сможете получить доступ к вашему приложению:

**Клиент**: Откройте браузер и перейдите по адресу [http://localhost:8081](http://localhost:8081)

**Сервер**: API сервера доступно по адресу [http://localhost:8080](http://localhost:8080)

## Завершение работы

Для остановки всех контейнеров используйте команду:

```bash
docker-compose down
```