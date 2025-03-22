"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDatabase = void 0;
const searchService_1 = require("./searchService");
const searchDatabase = (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }
    (0, searchService_1.performSearch)(query)
        .then((results) => res.status(200).json(results))
        .catch((error) => {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Failed to retrieve search results" });
    });
};
exports.searchDatabase = searchDatabase;
