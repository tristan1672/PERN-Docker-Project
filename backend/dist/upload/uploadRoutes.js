"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("./uploadController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" }); // Temporary storage for uploaded files
//post route to handle file uploads | single file | call uploadCSV function
router.post("/", upload.single("file"), uploadController_1.uploadCSV);
exports.default = router;
