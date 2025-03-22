"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const uploadService_1 = require("./uploadService");
//upload function
const uploadCSV = async (req, res) => {
    if (!req.file) { //null check
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        // Get file stats for progress calculation
        const stats = fs_1.default.statSync(req.file.path);
        const totalSize = stats.size;
        await (0, uploadService_1.processCSV)(req.file.path, (processedBytes) => {
            // Calculate progress percentage
            const progressPercent = Math.round((processedBytes / totalSize) * 100);
            // If this were a real-time application, you could emit events here
            // But for now, we'll just log the progress
            console.log(`Processing progress: ${progressPercent}%`);
        });
        res.status(200).json({ message: "File uploaded and processed successfully" });
    }
    catch (error) { //upload fail check
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to process file" });
    }
};
exports.uploadCSV = uploadCSV;
