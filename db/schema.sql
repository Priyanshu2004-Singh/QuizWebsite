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
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student', -- 'student' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Quizzes Table
-- ================================
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    level VARCHAR(20) NOT NULL, -- easy, medium, hard
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
    correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D'))
);

-- ================================
-- Attempts Table
-- ================================
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Feedback Table
-- ================================
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
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

-- ================================
-- Sample Data (Optional for Testing)
-- ================================
INSERT INTO users (username, email, password_hash, role) 
VALUES 
('admin', 'admin@example.com', 'hashedpassword', 'admin'),
('student1', 'student1@example.com', 'hashedpassword', 'student');

INSERT INTO quizzes (title, description, level, created_by) 
VALUES 
('JavaScript Basics', 'Test your knowledge of JS fundamentals', 'easy', 1);

INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES 
(1, 'What is the result of 2 + "2"?', '22', '4', 'Error', 'undefined', 'A'),
(1, 'Which keyword is used to declare a constant in JS?', 'var', 'let', 'const', 'static', 'C');
