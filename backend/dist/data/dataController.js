"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listData = void 0;
const dataService_1 = require("./dataService");
const ENTRIES_PER_PAGE = 10;
//paginated data request function
const listData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || ENTRIES_PER_PAGE;
    try {
        const data = await (0, dataService_1.getPaginatedData)(page, limit); //fetch paginated data
        res.status(200).json(data);
    }
    catch (error) { // error handling
        console.error("Error fetching data:", error); //log console
        res.status(500).json({ error: "Failed to retrieve data" }); //error response
    }
};
exports.listData = listData;
