import pool from "../db";

//search function 
export const performSearch = async (query: string) => {
  //search query in db
  const { rows } = await pool.query(
    `SELECT * FROM uploaded_data 
     WHERE name ILIKE $1 OR email ILIKE $1 OR body ILIKE $1 
     ORDER BY created_at DESC`,
    [`%${query}%`]
  );

  return { results: rows, count: rows.length };
};