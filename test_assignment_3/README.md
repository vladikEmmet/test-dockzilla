# Проект "Todo List"

Проект предоставляет возможность получать задачи по любой дате.
Он состоит из трех компонентов: клиентской части (HTML/CSS/JS), серверной части (NestJS) и базы данных (PostgreSQL).

## Установка и запуск

### 1. Установка Docker

Убедитесь, что на вашей машине установлен Docker. Если нет, установите его с официального сайта Docker: [https://www.docker.com/get-started](https://www.docker.com/get-started)

### 2. Клонирование репозитория

```bash
git clone https://github.com/vladikEmmet/test-dockzilla.git
cd test-dockzilla
cd test_assignment_3
```

### 3. Сборка и запуск проекта

```bash
docker-compose up --build
```

### 4. Доступ к приложению

После успешного запуска, вы сможете получить доступ к вашему приложению:

**Клиент**: Откройте браузер и перейдите по адресу [http://localhost](http://localhost)

**Сервер**: API сервера доступно по адресу [http://localhost:4200](http://localhost:4200)

## Завершение работы

Для остановки всех контейнеров используйте команду:

```bash
docker-compose down
```