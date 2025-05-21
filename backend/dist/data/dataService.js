"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedData = void 0;
const db_1 = __importDefault(require("../db"));
//pagination formatting function
const getPaginatedData = async (page, limit) => {
    const offset = (page - 1) * limit; //offset entry position based on page number | limit = max entries per page
    //Query with pagination using page limit and offset
    const { rows } = await db_1.default.query("SELECT * FROM uploaded_data ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
    //Query for total 
    const { rows: countRows } = await db_1.default.query("SELECT COUNT(*) FROM uploaded_data");
    const totalCount = parseInt(countRows[0].count);
    //paginated format data return
    return {
        data: rows,
        pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        },
    };
};
exports.getPaginatedData = getPaginatedData;
