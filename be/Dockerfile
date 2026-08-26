# Stage 1: Build Spring Boot app with Maven
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Pre-fetch Maven dependencies for caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and package JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Copy artifact from builder
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
