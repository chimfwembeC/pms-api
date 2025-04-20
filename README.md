
---

```markdown
# 🛠️ Project Management System API (PMS)

A simple Node.js and Express-based Project Management System API with JWT authentication and Sequelize ORM. It supports basic operations on Users, Projects, and Tasks with role-based access.

---

## 📦 Features

- User registration and login with JWT authentication
- Role-based user management (`admin`, `user`)
- CRUD operations for:
  - Users
  - Projects (linked to users)
  - Tasks (linked to both users and projects)
- Profile update with file upload support
- Sequelize ORM with migrations and seeders
- Secure password handling using bcrypt
- Clean modular route and model structure

---

## 📁 Tech Stack

- **Node.js** + **Express.js**
- **Sequelize ORM** + **PostgreSQL / MySQL / SQLite**
- **JWT (JSON Web Tokens)** for authentication
- **bcrypt** for password hashing
- **dotenv** for configuration
- **Busboy** for file uploads

---

## 🧬 Database Schema

### Users Table

| Column       | Type                | Description                      |
|--------------|---------------------|----------------------------------|
| id           | INTEGER (PK)        | Auto-incremented primary key     |
| username     | STRING              | User’s name                      |
| email        | STRING (unique)     | User’s email address             |
| bio          | STRING              | Short bio                        |
| password     | STRING              | Hashed password                  |
| role         | ENUM('admin','user')| Role of the user                 |
| createdAt    | DATE                | Created timestamp                |
| updatedAt    | DATE                | Updated timestamp                |

---

### Projects Table

| Column       | Type     | Description                      |
|--------------|----------|----------------------------------|
| id           | INTEGER  | Primary key                      |
| title        | STRING   | Project title                    |
| description  | TEXT     | Project description              |
| createdBy    | INTEGER  | FK referencing Users(id)         |
| createdAt    | DATE     | Created timestamp                |
| updatedAt    | DATE     | Updated timestamp                |

---

### Tasks Table

| Column       | Type     | Description                      |
|--------------|----------|----------------------------------|
| id           | INTEGER  | Primary key                      |
| title        | STRING   | Task title                       |
| description  | TEXT     | Task details                     |
| dueDate      | DATE     | Task due date                    |
| priority     | INTEGER  | Priority level (1-5)             |
| projectId    | INTEGER  | FK referencing Projects(id)      |
| assignedTo   | INTEGER  | FK referencing Users(id)         |
| createdAt    | DATE     | Created timestamp                |
| updatedAt    | DATE     | Updated timestamp                |

---

## 🔐 Authentication Flow

- **Register**: `/api/auth/register`
- **Login**: `/api/auth/login`
- **JWT Token** returned on login and registration
- Protected routes use `Authorization: Bearer <token>`
- **Update Profile**: `/api/auth/update-profile` (supports file upload)

---

## 📂 Project Structure

```
project/
│
├── config/                 # DB config
├── models/                 # Sequelize models
├── migrations/             # Sequelize migration files
├── seeders/                # Seeder files
├── routes/                 # Route handlers
│   ├── auth.js
│   ├── projects.js
│   ├── tasks.js
│   └── users.js
├── middleware/             # JWT middleware
├── uploads/                # Uploaded files (profile images etc.)
├── .env                    # Environment variables
├── app.js                  # App entry point
├── package.json
└── README.md
```

---

## 🧪 Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL / MySQL / SQLite
- `npm` or `yarn`

### Installation

```bash
git clone https://github.com/yourusername/pms-api.git
cd pms-api
npm install
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=pms_db
```

Update `config/config.json` to reflect your database settings.

---

## 🔧 Commands

### Run Server

```bash
npm start
```

### Run Migrations

```bash
npx sequelize-cli db:migrate
```

### Seed Demo Users

```bash
npx sequelize-cli db:seed:all
```

### Reset DB

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:undo:all
```

---

## 📮 API Endpoints

### Auth

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| POST   | `/api/auth/register`   | Register a new user    |
| POST   | `/api/auth/login`      | Authenticate user      |
| PUT    | `/api/auth/update-profile` | Update profile (with image) |
| GET    | `/api/auth/user`       | Get authenticated user |

---

### Projects

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | `/api/projects`     | Get all projects       |
| POST   | `/api/projects`     | Create new project     |
| PUT    | `/api/projects/:id` | Update a project       |
| DELETE | `/api/projects/:id` | Delete a project       |

---

### Tasks

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/api/tasks`     | Get all tasks        |
| POST   | `/api/tasks`     | Create a task        |
| PUT    | `/api/tasks/:id` | Update a task        |
| DELETE | `/api/tasks/:id` | Delete a task        |

---

## 👤 Users

| Method | Endpoint        | Description            |
|--------|-----------------|------------------------|
| GET    | `/api/users`    | Get list of users      |
| GET    | `/api/users/:id`| Get a specific user    |
| DELETE | `/api/users/:id`| Delete a user (admin)  |

---

## 🧪 Sample Credentials (from Seeders)

```bash
Admin
email: admin@example.com
password: password

User
email: user@example.com
password: password
```

---

## 🛡️ Security Notes

- JWT secret is randomly generated if not provided in `.env`
- Passwords are hashed with `bcrypt` (salt rounds = 10)
- Avoid uploading unsafe file types through profile update

---

## 📃 License

MIT License

---

## 🙌 Contributions

Feel free to fork, raise PRs, or open issues for improvements or bugs.

---

```