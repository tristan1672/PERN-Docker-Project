import express from "express";
import { listData } from "./dataController";

const router = express.Router();

router.get("/", listData); // GET request with pagination function

export default router;