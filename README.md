# hello-web-swing

This is a beginner-friendly Java web app using Spring Boot and Maven.

The app has one endpoint:

- GET / -> returns Hello, World!

## What You Are Looking At

This project demonstrates the smallest useful Spring Boot web application.

Main technologies:

- Java: the programming language.
- Spring Boot: a framework that makes it fast to build web apps and APIs.
- Maven: a build tool that handles dependencies and common tasks.
- Tomcat (embedded): the web server Spring Boot starts for you.

## How Web Apps Work (In 60 Seconds)

1. A browser sends an HTTP request (for example GET /).
2. The web server receives the request.
3. Spring finds a matching controller method.
4. Your Java method returns a response.
5. The server sends that response back to the browser.

In this app, the response is plain text: Hello, World!

## Project Structure

Key files:

- src/main/java/com/example/hellowebswing/HelloWebSwingApplication.java
	Starts the Spring Boot application.
- src/main/java/com/example/hellowebswing/HelloController.java
	Defines the GET / route.
- src/test/java/com/example/hellowebswing/HelloWebSwingApplicationTests.java
	Simple test to verify the app context loads.
- pom.xml
	Maven configuration (dependencies, plugins, Java version).

## Prerequisites

- Java 17 or newer
- Maven 3.9 or newer

Check versions:

```bash
java -version
mvn -version
```

## Run The App

```bash
mvn spring-boot:run
```

Then open:

- http://localhost:8080

You should see:

```text
Hello, World!
```

## Run Tests

```bash
mvn test
```

## Maven Basics For Students

Maven helps with three big jobs:

- Dependency management: downloads libraries like Spring Boot.
- Build lifecycle: compile, test, package.
- Repeatable commands: everyone uses the same commands.

Useful commands:

- mvn compile -> compile Java code.
- mvn test -> run tests.
- mvn package -> create a runnable JAR in target/.
- mvn spring-boot:run -> run app in development mode.

## Spring Boot Basics For Students

Important annotations in this app:

- @SpringBootApplication
	Marks the main class and enables auto-configuration.
- @RestController
	Marks a class as a web controller for REST endpoints.
- @GetMapping("/")
	Maps HTTP GET / to a Java method.

Why Spring Boot feels easy:

- It auto-configures many defaults.
- It ships with an embedded web server.
- It has strong conventions so you write less setup code.

## How To Expand This App

Here are simple next steps, from easiest to harder:

1. Add more routes
	 Example: /hello/name that returns Hello, <name>!
2. Return JSON instead of plain text
	 Return an object like {"message": "Hello"}.
3. Add HTML pages (Thymeleaf)
	 Build real web pages instead of plain text responses.
4. Add a service layer
	 Move logic out of controllers into service classes.
5. Add persistence with a database
	 Use Spring Data JPA with H2 or PostgreSQL.
6. Add input validation
	 Validate request data with annotations.
7. Add integration tests
	 Test endpoint behavior with MockMvc or TestRestTemplate.

## Example Expansion: Greeting By Name

You can create a second endpoint like:

- GET /hello/Ada -> Hello, Ada!

Hint: use @GetMapping("/hello/{name}") and @PathVariable.

## Common Beginner Errors

- 502 in Codespaces: app is not running on port 8080.
- Port already in use: another process is using 8080.
- Java version mismatch: project expects Java 17+.
- Maven not found: install Maven or use a dev container with Maven.

## Quick Recap

You built a real web app with very little code because Spring Boot and Maven handle a lot of setup for you. Focus on understanding request -> controller -> response first, then add features one small step at a time.
