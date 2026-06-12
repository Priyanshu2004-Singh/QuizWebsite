# QuizMaster — Full-Stack Quiz Web Application

> **Project Title:** QuizMaster  
> **Developer:** Priyanshu Singh  
> **Subject:** Web Technology — Final Project  
> **Technology Stack:** Node.js, Express.js, EJS, PostgreSQL, CSS3  
> **GitHub:** https://github.com/Priyanshu2004-Singh/QuizWebsite

---

## 1. Introduction & Objective

**QuizMaster** is a full-stack, role-based Quiz Web Application built using modern web technologies. The primary objective of this project is to create an interactive online quiz platform where:

- **Students (Users)** can register, browse available quizzes, take quizzes with multiple-choice questions, receive instant scores, view their result history, and submit feedback.
- **Administrators (Admins)** can create and manage quizzes, add questions manually or generate them using AI (OpenAI GPT), manage participants, view detailed analytics and leaderboards, and export reports as CSV files.

The application demonstrates the practical implementation of core web technology concepts including client-server architecture, server-side rendering, session-based authentication, role-based access control (RBAC), relational database design, RESTful routing, and modern UI/UX design.

---

## 2. Problem Statement

Traditional paper-based quizzes and examinations are time-consuming to create, distribute, and evaluate. There is a need for a digital platform that allows educators and administrators to:

1. Create quizzes dynamically with configurable question counts and marks.
2. Automatically evaluate student responses with advanced scoring (difficulty multipliers, negative marking).
3. Provide instant results and feedback to students.
4. Track performance analytics through leaderboards and per-question reports.
5. Generate questions using AI to reduce manual effort.

QuizMaster solves all of these problems in a single, unified web application.

---

## 3. Technology Stack

| Layer            | Technology                          | Purpose                                                              |
|------------------|-------------------------------------|----------------------------------------------------------------------|
| **Runtime**      | Node.js (v18+)                     | JavaScript runtime for server-side execution                         |
| **Framework**    | Express.js (v5)                    | Web application framework for routing, middleware, and HTTP handling  |
| **Templating**   | EJS (Embedded JavaScript Templates)| Server-side rendering of dynamic HTML pages                          |
| **Database**     | PostgreSQL                         | Relational database for persistent data storage                      |
| **DB Fallback**  | pg-mem (In-Memory SQL)             | In-memory PostgreSQL emulator for local development without a DB     |
| **Authentication** | bcrypt                           | Password hashing using the bcrypt algorithm (salt rounds: 10)        |
| **Sessions**     | express-session + connect-flash    | Server-side session management and flash messages                    |
| **AI Integration** | OpenAI GPT-3.5 Turbo API         | AI-powered automatic quiz question generation                       |
| **Styling**      | Vanilla CSS3                       | Custom dark-mode UI with glassmorphism, animations, and gradients    |
| **Security**     | Helmet, CSRF, Rate Limiting        | HTTP security headers, CSRF protection, brute-force prevention       |
| **Dev Tools**    | Nodemon, ESLint, Prettier          | Hot-reloading, code linting, and formatting                          |

---

## 4. System Architecture

### 4.1 Architecture Pattern: MVC (Model-View-Controller)

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                   │
│         HTML/CSS/JS rendered by EJS templates            │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Requests (GET/POST)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                     │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ Routes  │→ │Middleware │→ │     Controllers        │ │
│  │         │  │(auth,     │  │ (authController,       │ │
│  │ auth    │  │ session,  │  │  quizController,       │ │
│  │ quiz    │  │ flash,    │  │  adminController,      │ │
│  │ admin   │  │ urlencoded│  │  homeController)       │ │
│  │ home    │  │ static)   │  │                        │ │
│  └─────────┘  └──────────┘  └────────────┬───────────┘ │
│                                           │             │
│                                           ▼             │
│                              ┌────────────────────┐     │
│                              │   Database Layer    │     │
│                              │   (db/db.js)        │     │
│                              │                     │     │
│                              │  PostgreSQL (prod)  │     │
│                              │  pg-mem (fallback)  │     │
│                              └────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Request-Response Flow

1. User sends an HTTP request (e.g., `GET /quiz` or `POST /login`).
2. Express matches the request to a route defined in `routes/`.
3. Middleware runs in sequence: session initialization → flash message injection → authentication check.
4. The matched controller function executes business logic and queries the database.
5. The controller passes data to an EJS template in `views/`.
6. The server renders the HTML and sends the response to the browser.

---

## 5. Project Folder Structure

```
QuizWebsite/
├── app.js                    # Application entry point & server bootstrap
├── package.json              # Dependencies, scripts, and metadata
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
│
├── controllers/              # Business logic (MVC Controllers)
│   ├── authController.js     # Registration, login, logout, password reset
│   ├── quizController.js     # Quiz listing, taking, submission, results, feedback
│   ├── adminController.js    # Admin dashboard, quiz CRUD, AI generation, analytics
│   └── homeController.js     # Home page with live statistics
│
├── routes/                   # URL routing (MVC Routes)
│   ├── authRoutes.js         # /login, /register, /logout, /forgot, /reset/:token
│   ├── quizRoutes.js         # /quiz, /quiz/:id, /user/submit-quiz/:id, /feedback
│   ├── adminRoutes.js        # /admin/*, all admin endpoints
│   └── homeRoutes.js         # / (home page)
│
├── middleware/               # Custom Express middleware
│   └── auth.js               # ensureAuthenticated, ensureAdmin, ensureRole
│
├── db/                       # Database layer
│   ├── db.js                 # Database connector with PostgreSQL/pg-mem fallback
│   └── schema.sql            # Complete database schema (7 tables)
│
├── views/                    # EJS templates (MVC Views) — 20 pages
│   ├── home.ejs              # Landing page with hero, stats, featured quizzes
│   ├── login.ejs             # Login form
│   ├── register.ejs          # Registration form
│   ├── forgot.ejs            # Forgot password form
│   ├── reset.ejs             # Password reset form
│   ├── getAllQuiz.ejs         # Browse all quizzes with tier filter
│   ├── QuizPage.ejs          # Take quiz (MCQ interface with radio buttons)
│   ├── userResult.ejs        # User's personal result history & summary
│   ├── feedback.ejs          # Post-quiz feedback form
│   ├── admin.ejs             # Admin dashboard (metrics, actions, tables)
│   ├── adminCreateQuiz.ejs   # Quiz creation form (dynamic question fields)
│   ├── adminQuizSetup.ejs    # Step 1: Configure question count and marks
│   ├── adminGenerateQuestions.ejs  # AI question generation form
│   ├── adminQuizDetail.ejs   # Per-question analytics report
│   ├── adminLeaderboard.ejs  # Top performers leaderboard
│   ├── adminFeedback.ejs     # View and delete user feedback
│   ├── quizHistory.ejs       # All created quizzes history
│   ├── renderQuizCheck.ejs   # Select a quiz to view evaluations
│   ├── check-quiz.ejs        # Quiz evaluation with attempts list
│   └── add_participants.ejs  # Participant management with search/pagination
│
├── public/                   # Static assets
│   ├── css/
│   │   └── app.css           # Complete UI stylesheet (glassmorphism, animations)
│   └── images/               # Image assets
│
├── utils/                    # Utility functions
│   └── time.js               # Date/time helpers (addMinutes)
│
└── scripts/                  # Development scripts
    └── create_test_quiz.mjs  # Script to seed test quiz data
```

---

## 6. Database Design

### 6.1 Entity-Relationship Overview

The database consists of **7 tables** with proper foreign key relationships and cascading deletes:

```
┌─────────┐       ┌──────────┐       ┌────────────┐
│  users  │──1:N──│ quizzes  │──1:N──│ questions   │
│         │       │          │       │             │
│ id (PK) │       │ id (PK)  │       │ id (PK)     │
│ username│       │ title    │       │ quiz_id(FK) │
│ password│       │ level    │       │ question_text│
│ role    │       │ tier     │       │ option_a-d  │
│ created │       │ total_q  │       │ correct_opt │
└────┬────┘       │ marks/q  │       │ difficulty  │
     │            │ created  │       │ ai_generated│
     │            └────┬─────┘       └─────────────┘
     │                 │
     │    ┌────────────┤
     │    │            │
     ▼    ▼            ▼
┌──────────────┐  ┌───────────┐  ┌────────────────┐
│   attempts   │  │ feedback  │  │  responses     │
│              │  │           │  │                │
│ id (PK)      │  │ id (PK)   │  │ id (PK)        │
│ user_id (FK) │  │ user_id   │  │ attempt_id(FK) │
│ quiz_id (FK) │  │ quiz_id   │  │ question_id(FK)│
│ score        │  │ message   │  │ selected_option│
│ total_marks  │  │ created   │  │ is_correct     │
│ attempted_at │  └───────────┘  └────────────────┘
│ completed_at │
└──────────────┘

Additional tables: session (for session storage), password_resets (for token-based recovery)
```

### 6.2 Table Details

| Table              | Columns | Purpose                                                    |
|--------------------|---------|------------------------------------------------------------|
| **users**          | 5       | Stores registered users with hashed passwords and roles    |
| **quizzes**        | 8       | Quiz metadata (title, level, tier, marks per question)     |
| **questions**      | 9       | MCQ questions linked to quizzes (supports AI-generated flag)|
| **attempts**       | 6       | Records each quiz attempt with score and timestamps        |
| **responses**      | 5       | Per-question answer records for detailed analytics         |
| **feedback**       | 4       | User feedback messages linked to quizzes                   |
| **password_resets**| 4       | Token-based password recovery with expiration              |
| **session**        | 3       | Server-side session storage (connect-pg-simple compatible) |

---

## 7. Features — User Role

### 7.1 User Registration & Login
- Users register with a unique username (min 4 chars) and password (min 6 chars).
- Passwords are hashed using **bcrypt** with 10 salt rounds before storing.
- Login validates credentials against hashed passwords in the database.
- Sessions are managed server-side using **express-session** with secure cookie settings (httpOnly, sameSite: lax, 24-hour expiry).

### 7.2 Browse & Take Quizzes
- Users can browse all available quizzes on the `/quiz` page.
- Quizzes can be filtered by **tier** (Tier 1 for basic, Tier 2 for advanced/AI-generated).
- Each quiz displays: title, description, difficulty level, number of questions, and marks per question.
- The quiz-taking interface presents each question with 4 radio-button options (A, B, C, D).
- A sticky submission bar at the bottom ensures the submit button is always visible.

### 7.3 Advanced Scoring System
- **Difficulty Multipliers:** Easy (1x), Medium (1.5x), Hard (2x) — each question's marks are multiplied by its difficulty level.
- **Negative Marking:** For Tier 2+ quizzes, incorrect answers incur a 25% penalty of the question's weighted marks.
- **Score Normalization:** Scores are bounded (minimum 0) and rounded to the nearest integer.

### 7.4 Result History
- Users can view all their past quiz attempts on the `/user/results` page.
- Summary statistics displayed: total attempts, best score, average score.
- Each attempt shows: quiz title, score, total marks, and timestamp.

### 7.5 Feedback System
- After completing a quiz, users are redirected to a feedback form.
- Users can submit text feedback about the quiz experience.
- Feedback is stored in the database and visible to admins.

### 7.6 Password Recovery
- Users can request a password reset via the `/forgot` page.
- A cryptographically secure token (48-character hex) is generated using `crypto.randomBytes`.
- Tokens expire after 1 hour.
- Users reset their password by visiting `/reset/:token` and submitting a new password.

---

## 8. Features — Admin Role

### 8.1 Admin Dashboard
- A comprehensive dashboard at `/admin` with:
  - **4 Metric Cards:** Total quizzes, registered users, quiz attempts, feedback count.
  - **6 Action Cards:** Quick links to Create Quiz, Results, Feedback, Participants, Quiz History, Leaderboard.
  - **Recent Quizzes Table:** Last 5 created quizzes with details.
  - **Recent Attempts Table:** Last 5 quiz submissions across all users.
  - **Top Performers Table:** Top 5 users ranked by average score.

### 8.2 Quiz Creation (Manual — 2-Step Process)
1. **Step 1 — Setup:** Admin specifies the number of questions and marks per question.
2. **Step 2 — Build:** A dynamic form renders the exact number of question fields, each with: question text, 4 options (A-D), and correct answer selector.
3. Quiz and questions are saved atomically using a **database transaction** (BEGIN/COMMIT/ROLLBACK).

### 8.3 AI-Powered Question Generation
- Admins can generate quiz questions automatically using **OpenAI GPT-3.5 Turbo**.
- The admin provides: a topic, number of questions (1-50), difficulty level, and quiz title.
- The AI generates questions in JSON format, which are parsed and saved to the database.
- If no OpenAI API key is configured, a **fallback generator** creates placeholder questions.
- AI-generated questions are flagged with `ai_generated = TRUE` in the database.
- Generated quizzes are automatically assigned to **Tier 2**.

### 8.4 Participant Management
- View all registered users (non-admin) with pagination (10 per page).
- **Search** participants by username (ILIKE query).
- **Add** new participants directly (admin creates user account with username/password).
- **Delete** participants (cascading delete removes their attempts, responses, and feedback).
- **Export** participant list as a **CSV file**.

### 8.5 Quiz Evaluation & Results
- View all created quizzes and select one to review.
- Per-quiz evaluation page shows: quiz details, all questions with correct answers, and all user attempts with scores.

### 8.6 Per-Question Analytics
- Detailed report for each quiz at `/admin/quiz/:id/detail`.
- For each question: shows how many users selected each option (A/B/C/D count), total responses, and the most-chosen option.
- Helps identify confusing or poorly worded questions.

### 8.7 CSV Export
- Export per-question analytics as a downloadable CSV file.
- CSV includes: question ID, text, all options, correct answer, option counts, total responses, and most-chosen option.
- Also supports exporting participant lists as CSV.

### 8.8 Leaderboard
- Displays top 50 performers ranked by average score.
- Shows: username, total attempts, best score, and average score.

### 8.9 Feedback Management
- View all user feedback messages in a table.
- Delete individual feedback entries.

---

## 9. Security Features

| Feature                          | Implementation                                                |
|----------------------------------|---------------------------------------------------------------|
| **Password Hashing**            | bcrypt with 10 salt rounds                                    |
| **Session Security**            | httpOnly cookies, sameSite: lax, secure flag in production     |
| **Role-Based Access Control**   | `ensureAuthenticated`, `ensureAdmin`, `ensureRole` middleware  |
| **Input Validation**            | Server-side validation for all forms (username length, password length, required fields) |
| **SQL Injection Prevention**    | Parameterized queries ($1, $2...) used in all database operations |
| **CSRF Protection**             | csurf middleware (configurable)                               |
| **HTTP Security Headers**       | Helmet.js (configurable)                                      |
| **Rate Limiting**               | express-rate-limit on auth endpoints (configurable)           |
| **Cascading Deletes**           | Foreign key constraints with ON DELETE CASCADE                 |
| **Token-Based Password Reset**  | Cryptographically secure 48-char hex tokens with 1-hour expiry |

---

## 10. UI/UX Design

### 10.1 Design Philosophy
The UI follows a **premium dark-mode aesthetic** with a "Deep Cosmos" theme inspired by modern SaaS dashboards and glassmorphism design trends.

### 10.2 Key Design Features

| Feature                     | Description                                                    |
|-----------------------------|----------------------------------------------------------------|
| **Dark Mode**              | Deep navy/charcoal background (#030712) for reduced eye strain |
| **Glassmorphism**          | Frosted glass panels with `backdrop-filter: blur(30px)` and subtle inset borders |
| **Animated Background**    | Floating, glowing orb meshes (cyan & violet) using CSS `@keyframes` |
| **Gradient Text**          | Hero headings use blue-to-purple gradient fills               |
| **Staggered Animations**   | Page sections fade-in and slide-up sequentially on load        |
| **Glowing Hover Effects**  | Cards and buttons emit soft glows on hover                     |
| **Typography**             | Plus Jakarta Sans (body) + Space Grotesk (headings) from Google Fonts |
| **Responsive Design**      | Mobile-first approach with media queries for breakpoints       |
| **Interactive Quiz Options** | Selected radio options glow and highlight with accent border  |
| **Sticky Submit Bar**      | Quiz submission button stays visible while scrolling           |

### 10.3 Color Palette

| Variable           | Color     | Usage                     |
|--------------------|-----------|---------------------------|
| `--bg-0`           | `#030712` | Page background           |
| `--accent`         | `#4FACFE` | Primary accent (cyan)     |
| `--accent-secondary`| `#00F2FE`| Secondary accent (teal)   |
| `--accent-purple`  | `#B066FE` | Gradient accent (purple)  |
| `--success`        | `#10B981` | Success states (green)    |
| `--danger`         | `#ef4444` | Error states (red)        |
| `--text`           | `#F3F4F6` | Primary text (off-white)  |
| `--text-muted`     | `#9CA3AF` | Muted text (gray)         |

---

## 11. Pages & Screenshots Guide

The application consists of **20 EJS pages** organized as follows:

### Public Pages (No login required)
| # | Page        | URL            | Description                              |
|---|-------------|----------------|------------------------------------------|
| 1 | Home        | `/`            | Landing page with hero, stats, featured quizzes |
| 2 | Login       | `/login`       | User login form                          |
| 3 | Register    | `/register`    | New user registration form               |
| 4 | Forgot      | `/forgot`      | Password recovery request                |
| 5 | Reset       | `/reset/:token`| Password reset form                      |

### User Pages (Login required)
| # | Page         | URL                      | Description                             |
|---|--------------|--------------------------|-----------------------------------------|
| 6 | All Quizzes  | `/quiz`                  | Browse all quizzes with tier filter     |
| 7 | Take Quiz    | `/quiz/:id`              | MCQ quiz-taking interface               |
| 8 | Feedback     | `/feedback/:quizId`      | Post-quiz feedback form                 |
| 9 | My Results   | `/user/results`          | Personal result history & summary       |

### Admin Pages (Admin role required)
| #  | Page                | URL                              | Description                           |
|----|---------------------|----------------------------------|---------------------------------------|
| 10 | Dashboard           | `/admin`                         | Admin control center                  |
| 11 | Quiz Setup          | `/admin/create-quiz`             | Step 1: Configure quiz parameters     |
| 12 | Create Quiz         | `/admin/create-quiz?count=&marks=`| Step 2: Enter questions              |
| 13 | AI Generator        | `/admin/generate-questions`      | AI-powered question generation        |
| 14 | Quiz History        | `/admin/history`                 | All created quizzes                   |
| 15 | Results Overview    | `/admin/results`                 | Select quiz for evaluation            |
| 16 | Quiz Evaluation     | `/admin/quiz/:id/result`         | Detailed quiz evaluation              |
| 17 | Quiz Analytics      | `/admin/quiz/:id/detail`         | Per-question response analytics       |
| 18 | Leaderboard         | `/admin/leaderboard`             | Top performers ranking                |
| 19 | Participants        | `/admin/participants`            | User management (CRUD + search)       |
| 20 | Feedback            | `/admin/feedbacks`               | View and manage user feedback         |

---

## 12. API Routes Summary

### Authentication Routes (`authRoutes.js`)
| Method | Endpoint         | Auth     | Description               |
|--------|------------------|----------|---------------------------|
| GET    | `/login`         | Public   | Render login page         |
| POST   | `/login`         | Public   | Handle login              |
| GET    | `/register`      | Public   | Render register page      |
| POST   | `/register`      | Public   | Handle registration       |
| GET    | `/logout`        | Public   | Destroy session & logout  |
| GET    | `/forgot`        | Public   | Render forgot password    |
| POST   | `/forgot`        | Public   | Create reset token        |
| GET    | `/reset/:token`  | Public   | Render reset form         |
| POST   | `/reset/:token`  | Public   | Handle password reset     |

### Quiz Routes (`quizRoutes.js`)
| Method | Endpoint                  | Auth   | Description                   |
|--------|---------------------------|--------|-------------------------------|
| GET    | `/quiz`                   | User   | List all quizzes              |
| GET    | `/quiz/:id`               | User   | Take a specific quiz          |
| POST   | `/user/submit-quiz/:id`   | User   | Submit quiz answers           |
| GET    | `/feedback/:quizId`       | User   | Render feedback form          |
| POST   | `/feedback/:quizId`       | User   | Submit feedback               |
| GET    | `/user/results`           | User   | View personal results         |

### Admin Routes (`adminRoutes.js`)
| Method | Endpoint                         | Auth  | Description                    |
|--------|----------------------------------|-------|--------------------------------|
| GET    | `/admin`                         | Admin | Dashboard                      |
| GET    | `/admin/create-quiz`             | Admin | Quiz setup / creation form     |
| POST   | `/admin/create-quiz`             | Admin | Save quiz and questions        |
| GET    | `/admin/generate-questions`      | Admin | AI question generation form    |
| POST   | `/admin/generate-questions`      | Admin | Generate and save AI questions |
| GET    | `/admin/history`                 | Admin | Quiz history                   |
| GET    | `/admin/results`                 | Admin | Results overview               |
| GET    | `/admin/quiz/:id/result`         | Admin | Quiz evaluation                |
| GET    | `/admin/quiz/:id/detail`         | Admin | Per-question analytics         |
| GET    | `/admin/quiz/:id/detail/export`  | Admin | Export analytics as CSV        |
| GET    | `/admin/leaderboard`             | Admin | Leaderboard                    |
| GET    | `/admin/participants`            | Admin | Participant list               |
| POST   | `/admin/participants`            | Admin | Add participant                |
| POST   | `/admin/participants/delete/:id` | Admin | Delete participant             |
| GET    | `/admin/participants/export`     | Admin | Export participants as CSV     |
| GET    | `/admin/feedbacks`               | Admin | View feedback                  |
| POST   | `/admin/feedbacks/delete/:id`    | Admin | Delete feedback                |

---

## 13. How to Run the Project

### Prerequisites
- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- PostgreSQL (optional — the app uses an in-memory fallback if unavailable)

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Priyanshu2004-Singh/QuizWebsite.git

# 2. Navigate to the project directory
cd QuizWebsite

# 3. Install all dependencies
npm install

# 4. (Optional) Create a .env file for configuration
cp .env.example .env
# Edit .env to set DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY, etc.

# 5. Start the application
npm start

# 6. Open in browser
# Visit: http://localhost:3000
```

### Default Credentials
| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin    | admin123   |
| User  | *(Register a new account via /register)* | |

---

## 14. Key Technical Highlights

1. **Dual-Database Architecture:** Seamlessly switches between PostgreSQL and an in-memory `pg-mem` database, enabling zero-configuration local development.
2. **Transaction Safety:** Quiz creation uses `BEGIN/COMMIT/ROLLBACK` to ensure atomicity — either all questions are saved or none are.
3. **AI Integration:** OpenAI API integration with graceful fallback when API keys are unavailable.
4. **Advanced Scoring Engine:** Supports difficulty-weighted scoring and negative marking for competitive quiz formats.
5. **Per-Question Response Tracking:** Every answer is stored individually in the `responses` table, enabling granular analytics.
6. **CSV Export:** Admin can download quiz reports and participant lists for offline analysis.
7. **Modern CSS Architecture:** 577 lines of hand-crafted CSS featuring CSS custom properties, glassmorphism, `@keyframes` animations, and responsive design.
8. **ES Module Syntax:** Uses modern `import/export` syntax throughout (configured via `"type": "module"` in package.json).

---

## 15. Future Scope

1. **Timer-based Quizzes:** Add countdown timers with auto-submit functionality.
2. **Email Integration:** Send password reset tokens via email (currently displayed on screen for demo).
3. **Real-time Leaderboard:** WebSocket-powered live score updates during quiz events.
4. **Quiz Categories & Tags:** Organize quizzes by subject, topic, and difficulty.
5. **Student Analytics Dashboard:** Personal performance trends with charts and graphs.
6. **Containerization:** Docker support for easy deployment.
7. **CI/CD Pipeline:** Automated testing and deployment using GitHub Actions.
8. **Mobile App:** React Native or Flutter companion app.

---

## 16. Conclusion

QuizMaster is a comprehensive, production-ready quiz platform that demonstrates the practical application of full-stack web development concepts. It combines a robust Node.js/Express backend with a visually stunning dark-mode UI, secure authentication, role-based access control, AI-powered question generation, and detailed analytics — making it suitable for educational institutions, coding bootcamps, and corporate training programs.

---

## 17. References

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [EJS Templating](https://ejs.co/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [bcrypt npm Package](https://www.npmjs.com/package/bcrypt)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [MDN Web Docs — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

*This document provides a complete technical overview of the QuizMaster project. For generating a presentation, each numbered section (1–17) maps to a distinct slide or group of slides.*
