# ParkEase — Smart Parking Management System

> A production-grade, full-stack SaaS parking management platform with real-time slot tracking, role-based dashboards, and integrated payments.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat-square)

---

## Overview

ParkEase is a full-stack parking management system designed to digitize and streamline parking operations. It features real-time slot availability, an end-to-end booking and payment flow, and four role-based dashboards — all built from scratch with a production-quality architecture.

---

## Features

### User
- Browse real-time parking slot grid with color-coded availability
- Book a slot with custom duration
- Pay securely via Razorpay (UPI, Cards, Netbanking)
- View booking history with status and penalty details

### Admin
- Revenue analytics dashboard
- Add, delete, and update parking slots
- Monitor all bookings across users
- Slot status management (Available / Occupied / Maintenance)

### Staff
- View and manage active bookings
- Check vehicles in and out
- Real-time slot overview

### Guest
- View available slots without registration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Axios |
| Backend | Java 17, Spring Boot 3.5 |
| Security | Spring Security, JWT |
| Database | MySQL 8.0, Spring Data JPA |
| Payments | Razorpay |
| Build Tool | Maven |
| Version Control | Git + GitHub |

---

## Architecture

```
parkease/
├── backend/                         # Spring Boot REST API
│   └── src/main/java/com/parkease/backend/
│       ├── config/                  # JWT filter + Security config
│       ├── controller/              # REST controllers
│       ├── service/                 # Business logic
│       ├── repository/              # JPA repositories
│       ├── model/                   # Entity classes
│       ├── dto/                     # Request / Response DTOs
│       └── util/                    # JWT utility
│
└── frontend/                        # React application
    └── src/
        ├── api/                     # Axios + API calls
        ├── context/                 # Auth context
        └── pages/
            ├── auth/                # Login, Register
            ├── admin/               # Admin dashboard
            ├── staff/               # Staff dashboard
            └── user/                # User dashboard
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven (or use the included `mvnw` wrapper)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/lokidev05/parkease.git
cd parkease/backend

# Create the database
mysql -u root -p
CREATE DATABASE parkease_db;

# Configure application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your MySQL credentials and Razorpay keys

# Run the backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Slots
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/slots` | Get all slots |
| GET | `/api/slots/available` | Get available slots |
| POST | `/api/slots` | Create new slot (Admin) |
| PUT | `/api/slots/{id}/status` | Update slot status |
| DELETE | `/api/slots/{id}` | Delete slot |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get user's bookings |
| GET | `/api/bookings/all` | Get all bookings (Admin/Staff) |
| PUT | `/api/bookings/{id}/complete` | Complete booking with penalty calc |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |

---

## Database Schema

```sql
users          -- id, name, email, password (BCrypt), phone, role, created_at
parking_slots  -- id, slot_number, type (CAR/BIKE/EV), status, price_per_hour, floor
bookings       -- id, user_id, slot_id, start_time, end_time, duration, amount, penalty, status
```

---

## Environment Variables

Create `application.properties` from the example file and configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/parkease_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
razorpay.key.id=rzp_test_your_key_id
razorpay.key.secret=your_razorpay_secret
```

---

## Screenshots

> Add screenshots of the login page, user dashboard, parking grid, booking modal, payment flow, and admin dashboard here.

---

## Key Learnings

Built this project to learn and implement:

- JWT-based stateless authentication with Spring Security
- JPA entity relationships and database schema design
- Payment gateway integration with signature verification
- Role-based access control across four user types
- React context API for global auth state management
- Real-time UI updates with React state and Axios

---

## Author

**Lokesh T**
B.Tech CSE — Puducherry Technological University (2024–2028)

[![GitHub](https://img.shields.io/badge/GitHub-lokidev05-181717?style=flat-square&logo=github)](https://github.com/lokidev05)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lokesh%20T-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/lokesh-t)

---

## License

This project is open source and available under the [MIT License](LICENSE).
