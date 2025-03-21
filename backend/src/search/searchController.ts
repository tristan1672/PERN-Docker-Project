import { Request, Response } from "express";
import { performSearch } from "./searchService";

export const searchDatabase = (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  performSearch(query as string)
    .then((results) => res.status(200).json(results))
    .catch((error) => {
      console.error("Search Error:", error);
      res.status(500).json({ error: "Failed to retrieve search results" });
    });
};