import { Request, Response } from "express";
import { getPaginatedData } from "./dataService";

const ENTRIES_PER_PAGE = 10; 

//paginated data request function
export const listData = async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || ENTRIES_PER_PAGE;

  try {

    const data = await getPaginatedData(page, limit);           //fetch paginated data

    res.status(200).json(data);

  } catch (error) {                                             // error handling
                                                                
    console.error("Error fetching data:", error);               //log console

    res.status(500).json({ error: "Failed to retrieve data" }); //error response
  }
};