import express from "express";
import { searchDatabase } from "./searchController";

const router = express.Router();

router.get("/", searchDatabase); // GET request to with search function

export default router;