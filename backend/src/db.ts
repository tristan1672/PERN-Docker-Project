import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: 'user', 
  host: 'csv_postgres', 
  database: 'csv_db', 
  password: 'password', 
  port: 5432,
});
  
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connection successful:', res.rows);
  }
});

export default pool;