jest.mock('src/db', () => ({
    pool: {
      query: jest.fn(),
    },
  }));