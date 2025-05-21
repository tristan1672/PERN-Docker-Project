import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import searchRoutes from "./search/searchRoutes";
import uploadRoutes from "./upload/uploadRoutes";
import dataRoutes from "./data/dataRoutes";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // CORS is enabled here
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Enable JSON body parsing

// Root route
app.get("/", (req, res) => {
  console.log(req.method);
  res.send("Backend is running");
});

// Define routes
app.use("/search", searchRoutes);
app.use("/upload", uploadRoutes);
app.use("/data", dataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});