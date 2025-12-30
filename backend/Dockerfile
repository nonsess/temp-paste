# --- ЭТАП 1: Сборка (Build) ---
# Используем образ Maven с JDK 21 для компиляции
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Копируем pom.xml и скачиваем зависимости (кешируем этот слой)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копируем исходники и собираем проект
COPY src ./src
RUN mvn clean package -DskipTests

# --- ЭТАП 2: Запуск (Runtime) ---
# Используем легкий JRE (только среда выполнения) вместо полного JDK
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Копируем только готовый JAR из первого этапа
# Мы используем wildcard *.jar, чтобы не зависеть от точного имени версии
COPY --from=build /app/target/*.jar app.jar

# Указываем порт (в Spring по умолчанию 8080)
EXPOSE 8080

# Оптимальные параметры запуска для контейнера
ENTRYPOINT ["java", "-jar", "app.jar"]
