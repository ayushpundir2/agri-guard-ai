# AgriGuard-AI 🌾🛡️

AI-powered City Food-Resilience Intelligence Platform for Fund My Crazy — "Surprise Us!"

## Overview

AgriGuard-AI is designed to model the cascade from agricultural land risks to urban market supply disruptions, focusing on prototype city **Pune, Maharashtra, India**.

**Core Chain:**  
`Agricultural land → disaster → food markets → city food-supply risk → recovery priorities`

---

## Architecture Foundation

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, MapLibre GL JS
- **Backend:** Python, FastAPI, Pydantic v2, Uvicorn
- **Database:** PostgreSQL + PostGIS extension (runs easily via Docker Compose)
- **AI Integration (Future):** Gemini API via Backend service

---

## Folder Structure

```
agri-guard-ai/
├── backend/                # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API endpoints (health, etc.)
│   │   ├── core/           # Config, settings, database session
│   │   ├── models/         # Database ORM models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic engines (stubbed for future)
│   │   └── main.py         # FastAPI app initialization
│   ├── tests/              # Pytest test suite
│   ├── requirements.txt    # Python dependencies
│   └── pytest.ini          # Pytest configuration
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages & API proxy
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities & API client
│   ├── package.json        # Node dependencies & scripts
│   ├── tsconfig.json       # TypeScript configuration
│   └── tailwind.config.ts  # Tailwind CSS configuration
├── docker-compose.yml      # PostGIS database container setup
├── .env.example            # Environment template
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+ & npm
- Python 3.10+
- Docker & Docker Compose (for PostgreSQL + PostGIS)

### 1. Environment Setup

Copy `.env.example` to `.env` or set environment variables in respective frontend/backend folders if needed.

```bash
cp .env.example .env
```

### 2. Start PostGIS Database

```bash
docker-compose up -d
```

### 3. Backend Setup & Run

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Unix:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be running at [http://localhost:8000](http://localhost:8000).  
Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at [http://localhost:3000](http://localhost:3000).

---

## Testing & Verification

### Run Backend Tests

```bash
cd backend
pytest
```

### Run Frontend Build & Type Check

```bash
cd frontend
npm run build
```
