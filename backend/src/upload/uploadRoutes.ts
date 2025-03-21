import express from "express";
import multer from "multer";
import { uploadCSV } from "./uploadController";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

//post route to handle file uploads | single file | call uploadCSV function
router.post("/", upload.single("file"), uploadCSV);

export default router;