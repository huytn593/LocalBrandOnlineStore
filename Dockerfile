# Stage 1: Build the Java application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven settings and dependencies first (improves caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the Java application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the API port
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
