import { Request, Response } from "express";
import { performSearch } from "./searchService";

export const searchDatabase = async (req: Request, res: Response) => {
  const { query } = req.query; // Extracts the query string from request parameters

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {

    const results = await performSearch(query as string); // call search function

    res.status(200).json(results);

  } catch (error) { //error handling

    console.error("Search Error:", error);                //log

    res.status(500).json({ error: "Failed to retrieve search results" });
  }
};