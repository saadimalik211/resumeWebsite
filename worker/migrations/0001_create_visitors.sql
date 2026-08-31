-- Migration: Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  latitude TEXT,
  longitude TEXT,
  user_agent TEXT,
  visited_at INTEGER NOT NULL,
  session_id TEXT
);

CREATE INDEX idx_visited_at ON visitors(visited_at);
CREATE INDEX idx_country ON visitors(country);
CREATE INDEX idx_session_id ON visitors(session_id);
