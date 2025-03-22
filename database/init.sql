--Data format in database (no dynamic indexing required)
------------------------------------------
DROP TABLE IF EXISTS uploaded_data;

CREATE TABLE uploaded_data (
  post_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE uploaded_data DROP CONSTRAINT IF EXISTS uploaded_data_pkey;