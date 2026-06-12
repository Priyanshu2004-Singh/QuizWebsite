-- ================================
-- Database Schema for Quiz Website
-- ================================

-- Drop existing tables (for development reset)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS session CASCADE;

-- ================================
-- Users Table
-- ================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Quizzes Table
-- ================================
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    level VARCHAR(20) DEFAULT 'easy', -- easy, medium, hard
    tier INT DEFAULT 1, -- tier level for advanced quizzes (1,2,3...)
    total_questions INT NOT NULL DEFAULT 0,
    marks_per_question INT NOT NULL DEFAULT 1,
    created_by INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Questions Table
-- ================================
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option VARCHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D'))
    ,difficulty VARCHAR(20) DEFAULT 'medium' -- easy, medium, hard
    ,ai_generated BOOLEAN DEFAULT FALSE
);

-- ================================
-- Attempts Table
-- ================================
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    total_marks INT NOT NULL DEFAULT 0,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Feedback Table
-- ================================
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Sessions Table (for connect-pg-simple)
-- ================================
CREATE TABLE "session" (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Password resets table (tokens for password recovery)
DROP TABLE IF EXISTS password_resets CASCADE;
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Responses: store per-question answers for attempts
DROP TABLE IF EXISTS responses CASCADE;
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    attempt_id INT REFERENCES attempts(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    selected_option VARCHAR(1),
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data intentionally omitted.
-- Register a user and promote one account to admin for local testing.
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$jxaLgzfJEUwQuhWSETyoD.42bXRISBK42.9B1w/bDCEmEIkqT1quG', 'admin');
