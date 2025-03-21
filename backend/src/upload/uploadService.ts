import fs from "fs";
import csvParser from "csv-parser";
import pool from "../../db";

export const processCSV = async (filePath: string) => {
  const data: { post_id: number; name: string; email: string; body: string }[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.post_id && row.name && row.email && row.body) {
          data.push({
            post_id: parseInt(row.post_id),
            name: row.name,
            email: row.email,
            body: row.body,
          });
        }
      })
      .on("end", async () => {
        try {
          for (const row of data) {
            await pool.query(
              "INSERT INTO uploaded_data (post_id, name, email, body) VALUES ($1, $2, $3, $4)",
              [row.post_id, row.name, row.email, row.body]
            );
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};