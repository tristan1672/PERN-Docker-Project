import fs from "fs";
import csvParser from "csv-parser";
import pool from "../../db";

//csv processing function
export const processCSV = async (filePath: string) => {
  const data: { post_id: number; id : number; name: string; email: string; body: string }[] = []; //data buffer

  return new Promise<void>((resolve, reject) => {

    //Read stream pipe into csv-parser
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.id && row.post_id && row.name && row.email && row.body) { //data format check
          data.push({          
            post_id: parseInt(row.post_id),   
            id: parseInt(row.id), 
            name: row.name,
            email: row.email,
            body: row.body,
          });
        }
      })
      .on("end", async () => {
        try {
          if (data.length > 0) {
            //Insert as map
            const values = data
              .map(({ id, post_id, name, email, body }) => 
                `(${id}, ${post_id}, '${name}', '${email}', '${body.replace(/'/g, "''")}', NOW())`
              )
              .join(",");
            //inserting into db
            const query = `
              INSERT INTO uploaded_data (id, post_id, name, email, body, created_at)
              VALUES ${values}
              ON CONFLICT (id) DO NOTHING; -- Prevent duplicate IDs
            `;
              
            await pool.query(query);
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