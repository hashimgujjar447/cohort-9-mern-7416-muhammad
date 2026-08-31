# 📝 NotesMind — AI-Powered Notes App

A full-stack MERN application where users can create and manage their personal notes, with an integrated RAG-based chatbot to ask questions about their notes.

---

## 🏗️ Architecture Overview

```
cohort-9-mern-7416-muhammad/
├── backend/          # Node.js + Express + TypeScript (REST API)
├── frontend/         # React + TypeScript + Vite (SPA)
└── notes_chatbot/    # Python + FastAPI + LangChain (AI Service)
```

---

## ✨ Features

- **Authentication** — Register, login, email verification, forgot/reset password, JWT refresh tokens
- **Notes CRUD** — Create, read, update, delete rich-text notes (TipTap editor)
- **AI Chatbot** — Ask questions about your own notes using semantic search (RAG pipeline)
- **Background Jobs** — BullMQ + Redis queue for async AI ingestion tasks
- **Security** — Helmet, bcrypt, HttpOnly cookies, CORS, Zod validation

---

## 🛠️ Tech Stack

| Layer        | Technology                                                 |
| ------------ | ---------------------------------------------------------- |
| Frontend     | React 19, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit |
| Backend API  | Node.js, Express 5, TypeScript, Mongoose, BullMQ           |
| AI Service   | Python, FastAPI, LangChain, HuggingFace, ChromaDB          |
| Database     | MongoDB, Redis                                             |
| Testing      | Mocha + Chai (backend), Jest + Testing Library (frontend)  |
| Code Quality | SonarQube, ESLint                                          |

---

## 📁 Project Structure

### Backend (`/backend`)

```
src/
├── config/          # DB, Redis, logger, env config
├── middlewares/     # Auth, error handler, async wrapper
├── modules/
│   ├── auth/        # Register, login, verify email, reset password
│   ├── notes/       # CRUD notes
│   └── chat/        # AI chat + message history
├── queues/          # BullMQ AI job queue
├── services/        # AI service (calls Python chatbot), email service
├── workers/         # BullMQ workers
└── utils/           # API response helpers
```

### Frontend (`/frontend`)

```
src/
├── features/
│   ├── auth/        # Login, register, verify, forgot password pages
│   ├── notes/       # Notes list, editor pages
│   └── user/        # User profile
├── components/
│   ├── chat/        # Chat UI components
│   ├── editor/      # TipTap rich text editor
│   ├── layout/      # Sidebar, navbar
│   └── ui/          # Reusable UI components
├── store/           # Redux store & slices
└── utils/           # Axios, helpers
```

### AI Service (`/notes_chatbot`)

```
backend/
├── api/routes/      # FastAPI routes (ingestion, chatbot)
├── chatbot/         # LangChain chain, prompt, retriever, service
├── ingestion/       # Text splitter, vector store, embeddings
└── main.py          # FastAPI app entry point
```

---

## 🔌 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint                 | Auth | Description              |
| ------ | ------------------------ | ---- | ------------------------ |
| POST   | `/register`              | ❌   | Register new user        |
| POST   | `/login`                 | ❌   | Login & get tokens       |
| POST   | `/verify-email`          | ❌   | Verify email with OTP    |
| POST   | `/forgot-password`       | ❌   | Request password reset   |
| PUT    | `/reset-password/:token` | ❌   | Reset password           |
| POST   | `/refresh-token`         | ❌   | Refresh access token     |
| POST   | `/logout`                | ✅   | Logout user              |
| GET    | `/me`                    | ✅   | Get current user profile |

### Notes — `/api/v1/note`

| Method | Endpoint   | Auth | Description        |
| ------ | ---------- | ---- | ------------------ |
| POST   | `/create`  | ✅   | Create a note      |
| GET    | `/all`     | ✅   | Get all user notes |
| GET    | `/:noteId` | ✅   | Get single note    |
| PUT    | `/:noteId` | ✅   | Update note        |
| DELETE | `/:noteId` | ✅   | Delete note        |

### Chat — `/api/v1/chat`

| Method | Endpoint    | Auth | Description                |
| ------ | ----------- | ---- | -------------------------- |
| POST   | `/`         | ✅   | Send message to AI chatbot |
| GET    | `/messages` | ✅   | Get last 20 chat messages  |

### AI Service (FastAPI)

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| POST   | `/ingest` | Ingest note into vector DB |
| POST   | `/chat`   | Query chatbot with history |
| DELETE | `/delete` | Remove note embeddings     |
| GET    | `/health` | Health check               |

---

## 🤖 AI Pipeline (RAG)

```
User Note Created/Updated
        ↓
  BullMQ Queue (Redis)
        ↓
  Worker → FastAPI /ingest
        ↓
  Text Split (RecursiveCharacterTextSplitter)
        ↓
  HuggingFace Embeddings (all-MiniLM-L6-v2)
        ↓
  ChromaDB (persisted, per-user namespace)
        ↓
User asks question → Semantic Retrieval → LLM (GPT-OSS 120B via HuggingFace) → Answer
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesmind
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password
```

### AI Service (`notes_chatbot/.env`)

```env
HUGGINGFACEHUB_API_TOKEN=your_hf_token
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Python >= 3.10
- MongoDB (running locally or Atlas URI)
- Redis (running locally)

---

### 1. Backend

```bash
cd backend
npm install
npm run dev          # Development (tsx watch)
npm run build        # Compile TypeScript
npm start            # Run compiled build
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # ESLint
```

### 3. AI Service

```bash
cd notes_chatbot
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/macOS

pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

---

## 🧪 Testing

### Backend Tests (Mocha + Chai)

```bash
cd backend
npm test                 # Run all tests
npm run test:coverage    # With C8 coverage report
```

### Frontend Tests (Jest + Testing Library)

```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

---

## 📊 Code Quality (SonarQube)

```bash
# Backend
cd backend
npm run sonar

# Frontend
cd frontend
npm run sonar
```

> Update `sonar.token=your_token` in the respective `package.json` sonar script before running.

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (10 rounds)
- **JWT** access tokens (short-lived) + refresh tokens (HttpOnly cookies)
- **Helmet** for HTTP security headers
- **CORS** restricted to `CLIENT_URL`
- Input validation via **Zod** on both frontend and backend
- HTML sanitization via **DOMPurify** on frontend

---

## 👤 Author

Muhammad Hashim — Cohort 9 MERN Project
