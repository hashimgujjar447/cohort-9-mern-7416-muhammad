# Notes Dashboard

A full-stack notes management application built with the MERN stack (React, Node.js/Express, MongoDB) and TypeScript. It includes secure user authentication, rich text editing, organization tools (tags, color, pin, archive), JSON import/export, and an integrated AI notes assistant.

---

## Features

### 1. Authentication & Security
- User registration with OTP email verification.
- Secure login using JWT tokens and HTTP-only cookies.
- Forgot & reset password workflow.
- Protected routes on both client and server.

### 2. Note Management & Rich Text
- Create, view, edit, and delete personal notes.
- Rich text editor powered by **TipTap** (headings, lists, bold, italic, underline).
- HTML content sanitization via **DOMPurify**.
- Organize notes with tags, color coding, pinning, and archiving.

### 3. Search, Filter & Organization
- Instant debounced search by note title, content, or tags.
- Quick filter tabs on the dashboard to view **All**, **Pinned**, or **Archived** notes.
- Deterministic sorting (pinned notes stay at the top).

### 4. Data Import & Export
- **Export**: One-click download of all user notes in clean JSON format (`notes-export-YYYY-MM-DD.json`).
- **Import**: Upload any notes JSON file to batch import notes directly into the account.

### 5. AI Notes Assistant
- Context-aware chatbot trained on personal notes.
- Asynchronous ingestion pipeline using **BullMQ** and **Redis**.
- Vector search with **ChromaDB** to retrieve relevant notes context during conversation.

### 6. Logging, Validation & Code Quality
- Structured HTTP request/response and error logging using **Pino** and `pino-http`.
- Request validation on all endpoints using **Zod**.
- Centralized global error handling middleware.
- Automated testing with **Mocha/Chai** (backend) and **Jest** (frontend).
- **SonarQube** analysis configuration included.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Redux Toolkit (RTK Query), TipTap, Lucide Icons, Vite
- **Backend**: Node.js, Express 5, TypeScript, MongoDB & Mongoose, Pino Logger, BullMQ, Redis, Zod
- **AI Service**: Python FastAPI, LangChain, ChromaDB embeddings
- **Testing**: Mocha & Chai (Backend), Jest & React Testing Library (Frontend)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- Redis server running locally or via Docker

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notes_db
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
AI_SERVICE_URL=http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Running Tests

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```
