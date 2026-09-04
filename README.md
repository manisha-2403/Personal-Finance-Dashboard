# 💰 Personal Finance Dashboard

A full-stack personal finance management web application designed to help users track income, expenses, transactions, monthly budgets, financial reports, and spending insights through an interactive dashboard.

The application includes secure JWT authentication, protected routes, transaction CRUD operations, budget management, financial analytics, CSV export, and a responsive React interface.

## 🚀 Live Demo

🌐 **Live Application:**  
https://personal-finance-dashboard-xi-two.vercel.app/

⚙️ **Backend API:**  
https://personal-finance-dashboard-rufd.onrender.com/

📚 **API Documentation:**  
https://personal-finance-dashboard-rufd.onrender.com/docs

---

## ✨ Key Features

### 🔐 Authentication & Security

- User registration and login
- JWT-based authentication
- Password hashing
- Protected application routes
- Authenticated API requests
- Secure logout
- Automatic handling of expired/invalid authentication tokens

### 💰 Transaction Management

- Add income and expense transactions
- Edit transactions
- Delete transactions
- View transaction history
- Search transactions
- Filter transactions
- Categorize expenses
- Persistent transaction storage

### 📊 Financial Dashboard

- Total balance calculation
- Total income
- Total expenses
- Expense analytics
- Recent transactions
- Financial insights
- Interactive charts

### 🎯 Budget Management

- Create monthly budgets
- Track budget usage
- View remaining budget
- Monitor spending against budget limits

### 📈 Reports & Analytics

- Financial reports
- Expense analysis by category
- Monthly report filtering
- Income and expense analysis
- Transaction data visualization

### 📥 Data Export

- Export transactions to CSV

### 👤 User Management

- User profile
- Application settings
- Secure logout

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- REST API

### Database

- SQLite

### Deployment

- Vercel — Frontend
- Render — Backend
- GitHub — Source Code & Version Control

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Swagger / FastAPI Docs

---

## 🏗️ Architecture

```text
User
  │
  ▼
React + TypeScript Frontend
  │
  │ REST API / Axios
  ▼
FastAPI Backend
  │
  ├── JWT Authentication
  ├── Transaction CRUD
  ├── Budget Management
  ├── Reports & Analytics
  │
  ▼
SQLAlchemy
  │
  ▼
SQLite Database

### Dashboard

<img width="1592" height="796" alt="Screenshot 2026-08-29 135005" src="https://github.com/user-attachments/assets/ad7d2e22-b69a-4033-8f6d-9afc2f77e3e6" />

### Transactions

<img width="1597" height="786" alt="Screenshot 2026-08-29 135125" src="https://github.com/user-attachments/assets/a493f003-575d-4e72-b063-2791e847d665" />

### Reports

<img width="1585" height="795" alt="Screenshot 2026-08-29 135154" src="https://github.com/user-attachments/assets/c4017852-0d4f-45d7-a2ff-c624a2edc144" />

### Settings

<img width="1587" height="807" alt="Screenshot 2026-08-29 135217" src="https://github.com/user-attachments/assets/56ecb413-0723-4401-8da1-cfd81e78bbb3" />

## 🏗️ Project Structure

```text
Personal-Finance-Dashboard/
│
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── budget_crud.py
│   │   ├── budget_models.py
│   │   ├── budget_schemas.py
│   │   ├── config.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── LICENSE
└── README.md


