module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testTimeout: 10000
  };