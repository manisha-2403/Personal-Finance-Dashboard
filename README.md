# 💰 Personal Finance Dashboard

A full-stack personal finance management web application that helps users track income, expenses, transactions, monthly budgets, reports, and financial insights through an interactive dashboard.

Built with **React, TypeScript, Tailwind CSS, FastAPI, Python, SQLAlchemy, SQLite, and JWT authentication**.

## ✨ Features

- 🔐 User registration and login
- 🔑 JWT-based authentication
- 🛡️ Protected application routes
- 💰 Track income and expenses
- ➕ Add transactions
- ✏️ Edit transactions
- 🗑️ Delete transactions
- 🔍 Search and filter transactions
- 📊 Financial dashboard with income, expenses, and balance
- 📈 Expense analytics
- 🧾 Recent transaction overview
- 💡 Financial insights
- 🎯 Monthly budget management
- 📉 Budget usage and remaining balance tracking
- 📊 Financial reports
- 🗂️ Expense analysis by category
- 📅 Monthly report filtering
- 📥 Export transactions to CSV
- 👤 User profile page
- ⚙️ User settings
- 🚪 Secure logout

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

### Database

- SQLite

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Swagger / FastAPI Docs


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


