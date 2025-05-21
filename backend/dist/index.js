"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const searchRoutes_1 = __importDefault(require("./search/searchRoutes"));
const uploadRoutes_1 = __importDefault(require("./upload/uploadRoutes"));
const dataRoutes_1 = __importDefault(require("./data/dataRoutes"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // CORS is enabled here
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json()); // Enable JSON body parsing
// Root route
app.get("/", (req, res) => {
    console.log(req.method);
    res.send("Backend is running");
});
// Define routes
app.use("/search", searchRoutes_1.default);
app.use("/upload", uploadRoutes_1.default);
app.use("/data", dataRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
