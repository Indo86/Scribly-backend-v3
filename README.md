

# 📘 REST API Documentation

RESTful API ini dibangun menggunakan Express.js, JWT untuk autentikasi, dan mencakup resource: **Users**, **Notes**, dan **Todos**.

---

## 🔐 Authentication

Semua endpoint (kecuali login & register) memerlukan JWT Access Token:

Authorization: Bearer <your_token>

---

## 🧑‍💻 User API

### 📥 Register

POST /api/users/register

**Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}

🔑 Login

POST /api/users/login

Body:

{
  "email": "john@example.com",
  "password": "secret123"
}

Response:

accessToken (JSON)

refreshToken (via cookie)


🔁 Refresh Token

GET /api/users/token/refresh

🚪 Logout

POST /api/users/logout


---

👤 Get Profile

GET /api/users/profile

✏️ Update Profile

PUT /api/users/profile

Body:

{
  "username": "newname"
}

🔒 Change Password

PUT /api/users/profile/password

Body:

{
  "oldPassword": "secret123",
  "newPassword": "newpass456"
}


---

📋 Get All Users

GET /api/users/

➕ Create User (Admin)

POST /api/users/

🔍 Get User By ID

GET /api/users/:id

🛠 Update User

PUT /api/users/:id

❌ Delete User

DELETE /api/users/:id


---

📓 Notes API

Base route: /api/notes

📄 Get All Notes

GET /api/notes/

🔍 Get Note By ID

GET /api/notes/:id

➕ Create Note

POST /api/notes/

Body:

{
  "title": "Catatan Baru",
  "content": "Isi catatan..."
}

✏️ Update Note

PUT /api/notes/:id

❌ Delete Note

DELETE /api/notes/:id


---

✅ Todos API

Base route: /api/todos

📄 Get All Todos

GET /api/todos/

🔍 Get Todo By ID

GET /api/todos/:id

➕ Create Todo

POST /api/todos/

Body:

{
  "task": "Belajar Express.js",
  "completed": false
}

✏️ Update Todo

PUT /api/todos/:id

❌ Delete Todo

DELETE /api/todos/:id


---

⚙️ Environment Variables

Buat file .env di root project:

PORT=5000
ACCESS_TOKEN_SECRET=yourAccessSecret
REFRESH_TOKEN_SECRET=yourRefreshSecret


---

📦 Tech Stack

Express.js

JWT

bcryptjs

dotenv

Sequelize / Mongoose



