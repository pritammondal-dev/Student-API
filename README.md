# 🎓 Student Management REST API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** to manage student records. This project demonstrates CRUD (Create, Read, Update, Delete) operations using a clean MVC architecture, proper validation, error handling, and MySQL database integration.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MySQL
- mysql2

### Development Tools
- Nodemon
- Git
- Postman

---

## 📦 Packages Used

### Production Dependencies

```bash
npm install express mysql2 dotenv
```

### Development Dependency

```bash
npm install -D nodemon
```

---

## 📁 Project Structure

```text
Student-API/
│
├── database/
│   └── schema.sql
│
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── student.controller.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   └── student.model.js
│   ├── routes/
│   │   └── student.routes.js
│   ├── utils/
│   │   └── response.js
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD= your_password
DB_NAME=student_management
```

---

## 🛠️ Installation

Clone the repository:

```bash
git clone < https://github.com/pritammondal-dev/Student-API.git >
```

Move into the project:

```bash
cd Student-API
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🗄️ Database Setup

1. Start MySQL.
2. Open MySQL Workbench.
3. Execute the SQL from:

```text
database/schema.sql
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | / | Test API |
| POST | /api/students | Create Student |
| GET | /api/students | Get All Students |
| GET | /api/students/:id | Get Student By ID |
| PUT | /api/students/:id | Update Student |
| DELETE | /api/students/:id | Delete Student |

---

## ✅ Features

- Express.js REST API
- MySQL Integration
- CRUD Operations
- MVC Architecture
- Environment Variables
- Error Handling
- Request Validation
- Postman Testing
- Git Version Control

---

## 👨‍💻 Author

**Pritam Mondal**

Backend Developer (Learning Project)
