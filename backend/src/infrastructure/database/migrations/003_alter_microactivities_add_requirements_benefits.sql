-- Add requirements and benefits fields to microactivities
ALTER TABLE microactivities
  ADD COLUMN IF NOT EXISTS requirements TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Optional: update timestamps on change (handled in code)