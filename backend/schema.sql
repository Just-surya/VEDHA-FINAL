-- ====================================================================
-- VEDHA Student Management System — Supabase PostgreSQL Schema
-- ====================================================================

-- 1. Users / Staff Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Academic Coordinator',
    department VARCHAR(100) DEFAULT 'High School Wing',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index on username for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(20) NOT NULL,
    marks NUMERIC(5, 2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
    attendance NUMERIC(5, 2) NOT NULL CHECK (attendance >= 0 AND attendance <= 100),
    grade VARCHAR(5) NOT NULL,
    gender VARCHAR(20) DEFAULT 'Female',
    contact_email VARCHAR(150),
    guardian_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for search, filter, and leaderboard performance
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_marks ON students(marks DESC);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- 3. Monthly Attendance Trend Table
CREATE TABLE IF NOT EXISTS attendance_trend (
    id TEXT PRIMARY KEY,
    month VARCHAR(10) NOT NULL,
    attendance NUMERIC(5, 2) NOT NULL CHECK (attendance >= 0 AND attendance <= 100),
    sort_order INT NOT NULL DEFAULT 1
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_attendance_trend_sort ON attendance_trend(sort_order ASC);

-- 4. Term Metadata Table
CREATE TABLE IF NOT EXISTS term_meta (
    id TEXT PRIMARY KEY DEFAULT 'current',
    current_term VARCHAR(50) DEFAULT 'Term 2',
    academic_year VARCHAR(50) DEFAULT '2025-2026',
    previous_term JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- Initial Seed Data (Safe inserts with ON CONFLICT DO NOTHING)
-- ====================================================================

-- Default Staff Administrator (admin / admin123 hashed with bcrypt $2a$10$...)
-- bcrypt hash for 'admin123': $2a$10$wTf7oJ8rZzU5uYk5JqB4vOH8hAup5b6yG5j8iC1dYV8hV9xYc2N0e
INSERT INTO users (id, username, password_hash, name, role, department)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin',
    '$2a$10$64Q.J1kUqF1y3aM3gqjGheVwU/hFwJtJcEvlP4g56R2BfBq1gK9kS',
    'Staff Administrator',
    'Academic Coordinator',
    'High School Wing'
)
ON CONFLICT (username) DO NOTHING;

-- Initial Term Metadata
INSERT INTO term_meta (id, current_term, academic_year, previous_term)
VALUES (
    'current',
    'Term 2',
    '2025-2026',
    '{
      "totalStudents": 9,
      "deltaStudents": "+3 this term",
      "avgMarks": 69.9,
      "deltaMarks": "+2.1 vs last term",
      "avgAttendance": 89.8,
      "deltaAttendance": "-0.8 vs last term",
      "passRate": 94,
      "supportNeeded": "1 need support"
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    previous_term = EXCLUDED.previous_term,
    updated_at = now();

-- Initial Attendance Trend
INSERT INTO attendance_trend (id, month, attendance, sort_order)
VALUES
    ('trend-1', 'Jun', 88, 1),
    ('trend-2', 'Jul', 91, 2),
    ('trend-3', 'Aug', 87, 3),
    ('trend-4', 'Sep', 92, 4),
    ('trend-5', 'Oct', 89, 5),
    ('trend-6', 'Nov', 90, 6)
ON CONFLICT (id) DO NOTHING;
