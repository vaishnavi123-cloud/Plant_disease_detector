# FloraScan AI

FloraScan AI is a full-stack plant disease scanning app:
- Backend: Django + Django REST Framework
- Frontend: React + TypeScript + Vite
- Storage: SQLite (default)
- Image inference: Hugging Face model with automatic fallback logic if ML dependencies are unavailable

## Features

- Upload plant images and run disease analysis
- Returns plant name, disease name, confidence score, treatment, and prevention guidance
- Keeps scan history in the database
- Lets users clear scan history from the UI
- Serves uploaded media from Django
- Uses Vite proxy for local frontend-to-backend API calls

## Project Structure

- backend: Django project and REST API
- frontend: React app (Vite)
- backend/media/uploads: uploaded scan images
- backend/db.sqlite3: default local database

## Tech Stack

- Python, Django, Django REST Framework
- Pillow, Transformers, Torch (optional at runtime because fallback logic exists)
- React 18, TypeScript, Vite

## Prerequisites

- Python 3.10+
- Node.js 18+ (Node 20+ recommended)
- npm 10+

## Quick Start (Windows PowerShell)

### 1. Backend setup

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

### 2. Frontend setup (new terminal)

```powershell
Set-Location frontend
npm install
npm run dev -- --host
```

Frontend runs at `http://127.0.0.1:5173` (default Vite port).

## Environment Variables (Backend)

The backend loads variables from `backend/.env` if present.

Optional variables:

- `SECRET_KEY` (default is provided for development)
- `DEBUG` (default: `True`)
- `ALLOWED_HOSTS` (default: `*`)
- `DATABASE_URL` (optional; defaults to SQLite)

Example `backend/.env`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_URL=sqlite:///db.sqlite3
```

## API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

- `POST /scan/` - upload image and create a scan result
- `GET /history/` - list previous scan results (newest first)
- `DELETE /clear/` - remove all scan history

### `POST /api/scan/`

- Content type: `multipart/form-data`
- Field: `image`
- Accepted types: JPEG, JPG, PNG, WebP
- Max upload size: 10 MB

Example (PowerShell):

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/scan/ `
  -F "image=@C:\path\to\leaf.jpg"
```

## Development Checks

### Backend

```powershell
Set-Location backend
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
```

### Frontend

```powershell
Set-Location frontend
npm run lint
npm run build
```

## Inference Behavior

On first scan, the backend tries to load:
- processor: `google/mobilenet_v2_1.0_224`
- model: `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`

If model loading fails (for example, missing heavy ML dependencies), the app falls back to a lightweight color-based predictor so the API remains usable.

## Notes

- The Vite dev server proxies `/api` and `/media` to `http://127.0.0.1:8000`.
- CORS is currently open for development (`CORS_ALLOW_ALL_ORIGINS = True`).
- Keep production settings and secrets hardened before deploying.

## Deployment Hints

- Configure a production `SECRET_KEY`, restrictive `ALLOWED_HOSTS`, and `DEBUG=False`.
- Set `DATABASE_URL` for PostgreSQL or another managed database.
- Build frontend (`npm run build`) and serve static/media using your hosting setup.
