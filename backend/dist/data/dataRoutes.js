"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataController_1 = require("./dataController");
const router = express_1.default.Router();
router.get("/", dataController_1.listData); // GET request with pagination function
exports.default = router;
