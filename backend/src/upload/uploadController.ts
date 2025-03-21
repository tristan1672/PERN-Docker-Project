import { Request, Response } from "express";
import { processCSV } from "./uploadService";

export const uploadCSV = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    await processCSV(req.file.path);
    res.status(200).json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};