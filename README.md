# Habit Tracker Backend

This backend implements a simple MVC-Service structure for the Habit Tracker app.

Run locally:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```powershell
cd backend; npm install
```

3. Start dev server:

```powershell
npm run dev
```

API endpoints (basic):

- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password } => { token }
- `GET /api/habits` (auth)
- `POST /api/habits` (auth) => create habit
- `POST /api/habits/:id/toggle` (auth) => toggle today's completion
- `GET /api/habits/summary` (auth)
