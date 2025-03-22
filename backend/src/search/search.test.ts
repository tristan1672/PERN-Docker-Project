import { Request, Response } from 'express';
import { searchDatabase } from './searchController';
import { performSearch } from './searchService';
import pool from '../db';

// Mock dependencies
jest.mock('./searchService');
jest.mock('../db');

// Mock for Express Request and Response
const mockRequest = (query = {}) => ({
  query,
} as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Search Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if query parameter is missing', async () => {
    // Arrange
    const req = mockRequest();
    const res = mockResponse();

    // Act
    searchDatabase(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Search query is required' });
  });

  test('should return 400 if query parameter is empty', async () => {
    // Arrange
    const req = mockRequest({ query: '' });
    const res = mockResponse();

    // Act
    searchDatabase(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Search query is required' });
  });

  test('should return search results when query parameter is provided', async () => {
    // Arrange
    const req = mockRequest({ query: 'test' });
    const res = mockResponse();
    const mockResults = { 
      results: [{ id: 1, name: 'Test User', email: 'test@example.com', body: 'Test content' }], 
      count: 1 
    };
    
    (performSearch as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockResults);
    });

    // Act
    await searchDatabase(req, res);

    // Assert
    expect(performSearch).toHaveBeenCalledWith('test');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  test('should return 500 if search service throws an error', async () => {
    // Arrange
    const req = mockRequest({ query: 'test' });
    const res = mockResponse();
    
    // Mock a rejected promise properly
    (performSearch as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('Database error'));
    });
  
    // Act
    searchDatabase(req, res);
    
    // Wait for the promise chain to complete
    await new Promise(process.nextTick);
    
    // Assert
    expect(performSearch).toHaveBeenCalledWith('test');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve search results' });
  });
});

// Integration tests with supertest
import request from 'supertest';
import express from 'express';
import searchRoutes from './searchRoutes';

describe('Search API Integration', () => {
  let app: express.Application;
  
  beforeAll(() => {
    // Make sure any open handles are closed after tests
    jest.mock('../db', () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        end: jest.fn().mockResolvedValue(true)
      };
      return mockPool;
    });
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a new Express application for each test
    app = express();
    app.use('/search', searchRoutes);
    
    // Reset mocks for each test
    (performSearch as jest.Mock).mockReset();
  });
  
  afterAll(async () => {
    // Close any open database connections to prevent hanging tests
    await pool.end?.();
  });
  
  test('should return 400 when query parameter is missing', async () => {
    // Act & Assert
    const response = await request(app)
      .get('/search')
      .expect(400);
      
    expect(response.body).toHaveProperty('error', 'Search query is required');
    expect(performSearch).not.toHaveBeenCalled();
  });
  
  test('should return search results when query parameter is provided', async () => {
    // Arrange
    const mockResults = { 
      results: [{ id: 1, name: 'Test User', email: 'test@example.com', body: 'Test content' }], 
      count: 1 
    };
    (performSearch as jest.Mock).mockResolvedValue(mockResults);
    
    // Act & Assert
    const response = await request(app)
      .get('/search?query=test')
      .expect(200);
      
    expect(response.body).toEqual(mockResults);
    expect(performSearch).toHaveBeenCalledWith('test');
  });
  
  test('should handle errors from search service', async () => {
    // Arrange
    (performSearch as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('Database error'));
    });
    
    // Act & Assert
    const response = await request(app)
      .get('/search?query=error')
      .expect(500);
      
    expect(response.body).toHaveProperty('error', 'Failed to retrieve search results');
    expect(performSearch).toHaveBeenCalledWith('error');
  });

  test('should handle empty search results', async () => {
    // Arrange
    const emptyResults = { results: [], count: 0 };
    (performSearch as jest.Mock).mockResolvedValue(emptyResults);
    
    // Act & Assert
    const response = await request(app)
      .get('/search?query=nonexistent')
      .expect(200);
      
    expect(response.body).toEqual(emptyResults);
    expect(performSearch).toHaveBeenCalledWith('nonexistent');
  });
});