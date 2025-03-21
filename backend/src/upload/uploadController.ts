import fs from "fs";
import { Request, Response } from "express";
import { processCSV } from "./uploadService";

//upload function
export const uploadCSV = async (req: Request, res: Response) => {
  if (!req.file) { //null check
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {

    // Get file stats for progress calculation
    const stats = fs.statSync(req.file.path);
    const totalSize = stats.size;

    await processCSV(req.file.path, (processedBytes: number) => {
        // Calculate progress percentage
        const progressPercent = Math.round((processedBytes / totalSize) * 100);
        // If this were a real-time application, you could emit events here
        // But for now, we'll just log the progress
        console.log(`Processing progress: ${progressPercent}%`);
      });

    res.status(200).json({ message: "File uploaded and processed successfully" });

  } catch (error) { //upload fail check

    console.error("Upload Error:", error);

    res.status(500).json({ error: "Failed to process file" });
  }
};