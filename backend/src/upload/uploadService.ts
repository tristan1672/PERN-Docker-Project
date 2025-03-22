import fs from "fs";
import csvParser from "csv-parser";
import pool from "../db";

interface CsvRow {
  [key: string]: string; // All keys are strings, and their values are also strings
}

type ProgressCallback = (processedBytes: number) => void;

export const processCSV = async (filePath: string, progressCallback?: ProgressCallback) => {
  let processedBytes = 0;
  return new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => {
      processedBytes += chunk.length;
      if (progressCallback) {
        progressCallback(processedBytes);
      }
    });

    stream
      .pipe(csvParser())
      .on("data", async (row: CsvRow) => {
        console.log("Processing row:", row);

        try {
          // Normalize field names by removing quotes and trimming whitespace
          const normalizedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.replace(/"/g, "").trim(), // Remove quotes and trim key
              String(value).trim() // Ensure value is treated as a string and trim it
            ])
          );

          console.log("Normalized row:", normalizedRow);

          // Insert the row into the database
          const query = `
            INSERT INTO uploaded_data (post_id, id, name, email, body, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW());
          `;
          await pool.query(query, [
            normalizedRow.postId || '', // Treat as string
            normalizedRow.id || '',     // Treat as string
            normalizedRow.name || '',
            normalizedRow.email || '',
            normalizedRow.body || '',
          ]);

          console.log(`Row with id=${normalizedRow.id} successfully inserted into the database.`);
        } catch (error) {
          console.error(`Error inserting row with id=${row.id}:`, error);
        }
      })
      .on("end", () => {
        console.log("CSV processing completed.");
        resolve();
      })
      .on("error", (error) => {
        console.error("CSV parsing error:", error);
        reject(error);
      });
  });
};