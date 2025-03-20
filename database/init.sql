CREATE TABLE IF NOT EXISTS uploaded_data (
    id SERIAL PRIMARY KEY,         -- Auto-incrementing unique identifier
    post_id INTEGER NOT NULL,      -- Grouping ID for upload session
    name VARCHAR(255) NOT NULL,    -- Name of the user
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
    body TEXT NOT NULL,            -- Content body
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);