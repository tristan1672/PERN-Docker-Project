import pool from "../../db";

//pagination formatting function
export const getPaginatedData = async (page: number, limit: number) => {

  const offset = (page - 1) * limit; //offset entry position based on page number | limit = max entries per page
  
  //Query with pagination using page limit and offset
  const { rows } = await pool.query(
    "SELECT * FROM uploaded_data ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  
  //Query for total 
  const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM uploaded_data");
  const totalCount = parseInt(countRows[0].count);

  //paginated format data return
  return {
    data: rows,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};