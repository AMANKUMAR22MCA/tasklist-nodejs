# 📝 Task Manager Application

A full-stack Task Manager web application where users can manage  tasks with authentication, using **React.js**, **Node.js (Express.js)**, and **MongoDB Atlas**. The app supports user sign-up, login, and CRUD operations on  tasks.

## 🚀 Live Demo

> 🌐 **Frontend**: [https://tasklist-nodejs-tasklist-frontend.onrender.com](https://tasklist-nodejs-tasklist-frontend.onrender.com)  
> 🌐 **Backend**: [https://tasklist-nodejs-b6nt.onrender.com](https://tasklist-nodejs-b6nt.onrender.com)

---

## 🧩 Features

- 🔐 User Signup & Login (JWT-based authentication)
- 👤 User Profile with:
  - Name
  - Email
  - Password
  - Country
- 📁 Project Management (max 4 projects per user)
- ✅ Task Management (for each project)
  - Create a task
  - Read/View task list
  - Update task status & details
  - Delete a task
- 📆 Each Task contains:
  - Title
  - Description
  - Status (To Do, In Progress, Completed)
  - Created At, Completed At

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios
- CSS

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt.js (Password hashing)
- CORS

---


## 🔧 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AMANKUMAR22MCA/tasklist-nodejs.git
cd tasklist-nodejs
```

---

### 2️⃣ Backend Setup (Express.js)

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following variables:

```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

---

### 3️⃣ Frontend Setup (React.js)

```bash
cd ../frontend
npm install
```

Update the `baseURL` in `frontend/src/api.js` depending on your environment:

```js
// For local development:
// baseURL: 'http://localhost:5000/api',

// For production:
baseURL: 'https://tasklist-nodejs-b6nt.onrender.com/api',
```

---

## ▶️ Running Locally

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm start
```

Then, open your browser and navigate to:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🌐 Live Demo

👉 [Try it on Render](https://tasklist-nodejs-b6nt.onrender.com)

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Frontend:** React.js, Axios
- **Deployment:** Render

---

## 📂 Folder Structure

```
tasklist-nodejs/
├── backend/         # Express API
└── frontend/        # React frontend
```

---

