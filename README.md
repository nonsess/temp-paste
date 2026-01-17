# TempPaste — Сервис мгновенных заметок. Никакой регистрации, только текст и время.

Удобный веб-инструмент для быстрого обмена текстом и кодом. Создавайте заметки, устанавливайте время жизни и делитесь короткими ссылками.

## Технологии

### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Biome](https://img.shields.io/badge/Biome-F7D748?style=for-the-badge&logo=biome&logoColor=black)](https://biomejs.dev/)

### Backend
[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

### Инфраструктура
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

Публичная версия: https://temp.product-ready.ru

### ⚠️ Безопасность:

Поддерживается блэклист содержимого (настраивается через файл blacklist.txt на сервере).


---

## 📱 Скриншоты интерфейса

| Десктопная версия | Мобильная версия |
| :--- | :--- |
| ![Desktop Screen](https://github.com/nonsess/temp-paste/raw/main/docs/desktop1.png) | ![Mobile Screen](https://github.com/nonsess/temp-paste/raw/main/docs/mobile1.png) |
| *Главная страница с созданием заметки* | *Создание заметки на мобильном устройстве* |

| Десктопная версия | Мобильная версия |
| :--- | :--- |
| ![Desktop Screen](https://github.com/nonsess/temp-paste/raw/main/docs/desktop2.png) | ![Mobile Screen](https://github.com/nonsess/temp-paste/raw/main/docs/mobile2.png) |
| *Просмотр заметки с QR-кодом* | *Адаптивный интерфейс под мобилки* |


---

## 🛠 Как собрать и запустить

### 1. Подготовка окружения

> Убедитесь, что у вас установлены Docker и Docker Compose.

Создайте файл `.env` в корне проекта и заполните его по примеру .env.example

### 2. Запуск через Docker (Рекомендуется)

Для запуска всех сервисов (Бэкенд, Фронтенд, Редис) выполните:

```bash
docker compose up -d --build

```

Сайт будет доступен по адресу: `http://localhost`

---

## 📡 Описание API (Ручки)

Все API-запросы доступны через основной домен (или http://localhost при локальном запуске) по пути /api/v1.

### 1. Создание заметки

* **URL:** `/pastes`
* **Метод:** `POST`
* **Тело запроса (JSON):**
```json
{
  "text": "Привет, это моя заметка!",
  "ttl": 1440
}

```

*(ttl — время жизни в минутах: от 1 до 1440 (24 часа))*

### 2. Получение заметки

* **URL:** `/pastes/{id}`
* **Метод:** `GET`
* **Ответ:** Заметка или `404 Not Found`, если срок жизни истек.

---

## 🏗 Архитектура

1. **Next.js** отправляет запрос на создание заметки.
2. **Spring Boot** генерирует уникальный короткий ID и сохраняет заметку в **Redis** с использованием механизма `EXPIRE` (TTL).

---

## 👥 Наша команда

* **Backend:** https://github.com/bardTulpan
* **Frontend:** https://github.com/nonsess

> Проект разработан в рамках совместного обучения и практики деплоя современных веб-приложений. С любовью для разрабов
