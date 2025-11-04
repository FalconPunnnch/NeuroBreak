CREATE TABLE IF NOT EXISTS microactivities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Mente', 'Creatividad', 'Cuerpo')),
  duration INTEGER NOT NULL,
  concentration_time INTEGER,
  steps JSONB,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_microactivities_category ON microactivities(category);