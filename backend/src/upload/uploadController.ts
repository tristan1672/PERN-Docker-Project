import { Request, Response } from "express";
import { processCSV } from "./uploadService";

//upload function
export const uploadCSV = async (req: Request, res: Response) => {
  if (!req.file) { //null check
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {

    await processCSV(req.file.path); //call csv processing function

    res.status(200).json({ message: "File uploaded and processed successfully" });

  } catch (error) { //upload fail check

    console.error("Upload Error:", error);

    res.status(500).json({ error: "Failed to process file" });
  }
};