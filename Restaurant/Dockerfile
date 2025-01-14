# Use a Java base image
FROM openjdk:17-jdk-slim AS build

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and build configuration files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Download dependencies (skip tests)
RUN ./gradlew build --no-daemon -x test

# Copy the entire project
COPY . .

# Build the application
RUN ./gradlew clean build --no-daemon -x test --refresh-dependencies

# Second stage: Copy the artifact to a new image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Copy the .env file into the image
COPY .env /app/.env

# Expose the application port
EXPOSE 8081

# Set environment variables for the app
ENV DOTENV_PATH=/app/.env

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
