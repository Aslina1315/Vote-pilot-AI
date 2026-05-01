# VotePilot AI 🗳️

**A production-ready, voice-enabled AI election guide that empowers every citizen to vote with confidence.**

[![Firebase Hosting](https://img.shields.io/badge/Frontend-Firebase%20Hosting-orange)](https://firebase.google.com/)
[![Cloud Run](https://img.shields.io/badge/Backend-Google%20Cloud%20Run-blue)](https://cloud.google.com/run)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-green)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)

---

## 🌟 Overview

VotePilot AI is a full-stack web application that uses Google Gemini AI to guide users through the U.S. election process — from checking eligibility to casting their ballot. It features voice input/output, an interactive voting simulation, a readiness score engine, and mistake prevention warnings.

---

## 🏗️ Architecture

```
Vote-pilot-AI/
├── client/                    # React frontend (Firebase Hosting)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # AppLayout, Sidebar, Header
│   │   │   ├── chat/          # ChatMessage, ChatInput, TypingIndicator
│   │   │   └── journey/       # JourneyTracker, ReadinessCard
│   │   ├── pages/             # Home, Assistant, Journey, Simulation, Readiness, Settings
│   │   ├── hooks/             # useVoice, useChat, useJourney
│   │   ├── services/          # api.js (axios)
│   │   ├── context/           # AppContext (global state)
│   │   └── __tests__/         # Component tests
│   └── tailwind.config.js
│
├── server/                    # Node.js/Express backend (Google Cloud Run)
│   ├── routes/                # ai.js, user.js, journey.js
│   ├── controllers/           # aiController, userController, journeyController
│   ├── services/              # geminiService.js, journeyService.js
│   ├── middleware/            # rateLimiter, errorHandler, validator, requestLogger
│   ├── models/                # User.js, Journey.js (Mongoose)
│   └── __tests__/             # API route tests
│
├── firebase.json              # Firebase Hosting config
└── README.md
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Multi-turn conversation with Google Gemini API |
| 🗺️ **Journey Tracker** | 4-step progress: Eligibility → Documents → Registration → Voting |
| 🗳️ **Voting Simulation** | Step-by-step election day walkthrough (WOW feature) |
| 📊 **Readiness Engine** | Dynamic % score with next-action AI suggestions |
| ⚠️ **Mistake Prevention** | Context-aware warnings saved to user profile |
| 🎙️ **Voice Interaction** | Web Speech API for voice input + TTS output |
| ♿ **Accessibility** | WCAG 2.1, ARIA labels, keyboard navigation, 16px+ fonts |

---

## 🔒 Security

- **API Keys**: Gemini API key is stored in `server/.env` — **never exposed to the frontend**
- **Rate Limiting**: Global (100 req/15min) + AI-specific (15 req/min)
- **Input Validation**: All inputs validated & sanitized with `express-validator`
- **Helmet**: Secure HTTP headers on all responses
- **Error Handling**: Production errors never leak stack traces
- **CORS**: Configured to only allow the frontend origin

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone & Install

```bash
# Install frontend deps
cd client && npm install

# Install backend deps
cd ../server && npm install
```

### 2. Configure Environment Variables

```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/votepilot
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_ORIGIN=http://localhost:3000
PORT=5000
NODE_ENV=development
```

```bash
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

The app will open at **http://localhost:3000**

---

## 🧪 Running Tests

**Backend tests:**
```bash
cd server && npm test
```

**Frontend tests:**
```bash
cd client && npm test
```

---

## ☁️ Deployment

### Frontend → Firebase Hosting
```bash
cd client
npm run build
firebase deploy --only hosting
```

### Backend → Google Cloud Run
```bash
cd server
gcloud run deploy votepilot-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,MONGODB_URI=your_uri,NODE_ENV=production
```

After deploying the backend, update `REACT_APP_API_URL` in your Firebase environment with the Cloud Run URL, then redeploy the frontend.

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/chat` | Send AI message (rate-limited) |
| `GET` | `/api/ai/guidance` | Get stage-specific voting tip |
| `DELETE` | `/api/ai/history/:id` | Clear conversation history |
| `GET` | `/api/user/:sessionId` | Get user profile |
| `POST` | `/api/user` | Create/update user profile |
| `GET` | `/api/journey/:sessionId` | Get voting journey |
| `POST` | `/api/journey/:sessionId/step` | Update journey step |
| `GET` | `/api/health` | Health check |

---

## 🎨 Design System

- **Primary Color**: `#1E3A8A` (Deep Blue)
- **Accent**: `#F59E0B` (Amber)
- **Style**: Glassmorphism dark theme
- **Fonts**: Inter + Outfit (Google Fonts)
- **Min Font Size**: 16px (WCAG compliant)

---

## 📄 License

MIT — Built with ❤️ to empower civic participation.
