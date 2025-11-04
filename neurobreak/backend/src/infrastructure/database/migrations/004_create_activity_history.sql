CREATE TABLE IF NOT EXISTS activity_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  microactivity_id INTEGER NOT NULL REFERENCES microactivities(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration INTEGER,
  mood_id INTEGER REFERENCES mood_entries(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_history_user_id ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_completed_at ON activity_history(completed_at);