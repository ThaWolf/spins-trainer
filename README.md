# Spins Trainer API

## 📌 Project Overview
Spins Trainer is a backend API for poker preflop training in Spins format. It provides authentication, preflop tables, training sessions, and scenarios using Prisma and PostgreSQL.

## 🚀 Getting Started
Follow these steps to set up the project on your machine from scratch.

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://www.docker.com/)

### **2️⃣ Clone the Repository**
```bash
git clone <your-repo-url>
cd spins_trainer
```

### **3️⃣ Install Dependencies**
```bash
yarn install
```

### **4️⃣ Set Up Environment Variables**
Create a `.env.production` file in the project root with the following content:
```env
PORT=8080
DATABASE_URL=postgresql://spins_admin:strongpassword@postgres_db:5432/spins_trainer_db
JWT_SECRET=supersecurejwtkey
```

### **5️⃣ Start the Application (Using Docker)**
Run the following command to start the API and the database:
```bash
docker-compose up -d --build
```
This will:
✅ Start the PostgreSQL database
✅ Run the API on `http://localhost:8080`

### **6️⃣ Apply Database Migrations**
```bash
yarn prisma migrate dev --name init
```

### **7️⃣ Running Tests**
Run API tests using Jest:
```bash
yarn test
```

### **8️⃣ Accessing API Documentation**
Swagger docs are available at:
👉 `http://localhost:8080/api-docs`

### ✅ Everything is set up!
Now you can start using Spins Trainer API. 🚀
