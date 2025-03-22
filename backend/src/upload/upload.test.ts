import request from "supertest";
import { uploadCSV } from "./uploadController";
import { processCSV } from "./uploadService";
import fs from "fs";
import express, { Express } from "express";
import multer from "multer";

// Mock dependencies
jest.mock("fs");
jest.mock("./uploadService");

const mockApp: Express = express();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadCSV);
mockApp.use("/upload", router);

describe("Upload API Tests", () => {
  let mockRequest: any, mockResponse: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  test("should return 400 if no file is uploaded", async () => {
    await uploadCSV(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "No file uploaded" });
  });

  test("should process CSV file and return 200 on success", async () => {
    mockRequest = {
      file: { path: "test/path/file.csv" },
    };

    // Mock fs.statSync to return a fake file size
    (fs.statSync as jest.Mock).mockReturnValue({ size: 1024 });

    // Mock processCSV function
    (processCSV as jest.Mock).mockResolvedValue(undefined);

    await uploadCSV(mockRequest as any, mockResponse as any);

    expect(fs.statSync).toHaveBeenCalledWith("test/path/file.csv");
    expect(processCSV).toHaveBeenCalledWith("test/path/file.csv", expect.any(Function));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "File uploaded and processed successfully" });
  });

  test("should return 500 if processing fails", async () => {
    mockRequest = {
      file: { path: "test/path/file.csv" },
    };

    (fs.statSync as jest.Mock).mockReturnValue({ size: 1024 });

    // Simulate an error in processCSV
    (processCSV as jest.Mock).mockRejectedValue(new Error("Mock error"));

    await uploadCSV(mockRequest as any, mockResponse as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Failed to process file" });
  });

  test("should return 400 when no file is uploaded (Integration Test)", async () => {
    const response = await request(mockApp).post("/upload");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "No file uploaded");
  });
});