CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  microactivity_id INTEGER NOT NULL REFERENCES microactivities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, microactivity_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);