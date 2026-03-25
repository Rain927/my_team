# Football Club Management System

A full-stack web application for managing a football club, built with **Spring Boot** and **React**.

## Features

- **Player Management**: Add, edit, delete, and filter players by position/status
- **Training Schedule**: Create and manage training sessions with date, time, location, and type
- **Finance Management**: Track income/expenses with charts and financial summaries

## Tech Stack

### Backend
- Spring Boot 2.7
- Spring Data JPA
- H2 In-Memory Database
- Java 17

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui Components
- Recharts (charts)
- React Router v6

## Getting Started

### Backend

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

The backend runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### API Endpoints

| Module    | Method | Endpoint               | Description          |
|-----------|--------|------------------------|----------------------|
| Players   | GET    | /api/players           | List all players     |
| Players   | POST   | /api/players           | Add a player         |
| Players   | PUT    | /api/players/{id}      | Update a player      |
| Players   | DELETE | /api/players/{id}      | Delete a player      |
| Trainings | GET    | /api/trainings         | List all trainings   |
| Trainings | POST   | /api/trainings         | Create training      |
| Trainings | PUT    | /api/trainings/{id}    | Update training      |
| Trainings | DELETE | /api/trainings/{id}    | Delete training      |
| Finances  | GET    | /api/finances          | List all records     |
| Finances  | POST   | /api/finances          | Add a record         |
| Finances  | PUT    | /api/finances/{id}     | Update a record      |
| Finances  | DELETE | /api/finances/{id}     | Delete a record      |
| Finances  | GET    | /api/finances/summary  | Financial summary    |
