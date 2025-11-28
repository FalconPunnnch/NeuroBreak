-- Convert requirements and benefits to JSONB arrays (drops existing TEXT if any)
ALTER TABLE microactivities
  DROP COLUMN IF EXISTS requirements,
  DROP COLUMN IF EXISTS benefits;

ALTER TABLE microactivities
  ADD COLUMN requirements JSONB,
  ADD COLUMN benefits JSONB;

/*
No data migration needed (assumed new feature). If converting existing TEXT content in future, use ALTER COLUMN ... TYPE JSONB USING ... safely.
*/