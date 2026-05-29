QuizMaster — full-stack Quiz Web Application

Overview
 - Node.js + Express server with server-side EJS views.
 - PostgreSQL (production) with an in-memory `pg-mem` fallback for quick local runs.
 - Features: user registration/login, tiered quizzes, admin panel, AI-assisted question generation, per-question responses, leaderboard and CSV exports.

Quick Start (development)
1. Install dependencies:

	npm install

2. Create a `.env` at the project root (example):

	DATABASE_URL=postgres://user:password@localhost:5432/quizdb
	SESSION_SECRET=your_secret
	PORT=3000
	OPENAI_API_KEY=your_api_key   # optional, used for AI question generation

3. Run the app:

	npm start

4. Open the site: http://localhost:3000

Notes
- If PostgreSQL is not available locally the app falls back to an in-memory `pg-mem` instance — data will not persist across restarts.
- Admin seeded credentials (development):
  - username: admin
  - password: admin123

Key Functionality
- Tiered quizzes: filter quizzes by `tier` (Tier 1, Tier 2) and difficulty.
- Advanced scoring: difficulty multipliers and negative marking applied on submit.
- AI question generator: Admins can generate Tier‑2 quizzes using OpenAI (requires `OPENAI_API_KEY`).
- Per-question responses: stored in `responses` table for detailed reporting.
- CSV export: Admin per-quiz report CSV is available at `/admin/quiz/:id/detail/export`.

Testing
- Quick manual test flow (uses curl to persist a session cookie):

  # register/login
  curl -c /tmp/ck -d "username=testuser&password=pass123" -X POST http://localhost:3000/register
  curl -b /tmp/ck -d "username=testuser&password=pass123" -X POST http://localhost:3000/login

  # download CSV as admin (after logging in as admin and saving cookie to /tmp/admin_ck)
  curl -b /tmp/admin_ck http://localhost:3000/admin/quiz/7/detail/export -o quiz_7_report.csv

Project structure (high level)
- `app.js` — application bootstrap and routes
- `controllers/` — route handlers (auth, admin, quiz)
- `routes/` — express routers
- `views/` — EJS templates
- `db/` — database connector and `schema.sql`

Contributing
- Open a PR for bug fixes and features. Add tests where possible.

Further improvements (planned)
- Automated tests for scoring and AI generation
- Containerization + CI pipeline
- Improved migration tooling for PostgreSQL

License
MIT
