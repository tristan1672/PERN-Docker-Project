"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const db_1 = __importDefault(require("../db"));
//csv processing function
const processCSV = async (filePath, progressCallback) => {
    let processedBytes = 0;
    return new Promise((resolve, reject) => {
        const fileSize = fs_1.default.statSync(filePath).size;
        const stream = fs_1.default.createReadStream(filePath);
        stream.on('data', (chunk) => {
            processedBytes += chunk.length;
            if (progressCallback) {
                progressCallback(processedBytes);
            }
        });
        stream
            .pipe((0, csv_parser_1.default)())
            .on("data", async (row) => {
            console.log("Processing row:", row);
            try {
                // Parse numeric fields and trim strings
                const id = parseInt(row.id, 10); // Parse 'id' as integer
                const post_id = parseInt(row['"postId"'], 10); // Parse '"postId"' as integer
                // Validate that id and post_id are valid numbers
                if (isNaN(id) || isNaN(post_id)) {
                    console.warn(`Invalid row skipped (NaN id or post_id):`, row);
                    return;
                }
                // Insert the row into the database
                const query = `
            INSERT INTO uploaded_data (id, post_id, name, email, body, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (id) DO NOTHING;
          `;
                await db_1.default.query(query, [
                    id,
                    post_id,
                    row.name?.trim() || '', // Default to empty string if undefined
                    row.email?.trim() || '',
                    row.body?.trim() || '',
                ]);
                console.log(`Row with id=${id} successfully inserted into the database.`);
            }
            catch (error) {
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
exports.processCSV = processCSV;
