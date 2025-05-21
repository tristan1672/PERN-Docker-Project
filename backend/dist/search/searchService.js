"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performSearch = void 0;
const db_1 = __importDefault(require("../db"));
//search function 
const performSearch = async (query) => {
    //search query in db
    const { rows } = await db_1.default.query(`SELECT * FROM uploaded_data 
     WHERE name ILIKE $1 OR email ILIKE $1 OR body ILIKE $1 
     ORDER BY created_at DESC`, [`%${query}%`]);
    return { results: rows, count: rows.length };
};
exports.performSearch = performSearch;
