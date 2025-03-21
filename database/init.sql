--Data format in database (no dynamic indexing required)
------------------------------------------
CREATE TABLE IF NOT EXISTS uploaded_data (
    post_id INTEGER NOT NULL,      -- Regular integer from CSV
    id INTEGER PRIMARY KEY,        -- ID directly from the CSV
    name VARCHAR(255) NOT NULL,    -- Name of the user
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'), -- Validate email format
    body TEXT NOT NULL,            -- Content body
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record is added
);