module.exports = {
    // Indicates whether the coverage information should be collected while executing the test
    // collectCoverage: true,
    collectCoverageFrom: [
      '**/*.js',
      '!node_modules/**',
      '!coverage/**',
      '!config/**',
      '!jest.config.js',
      '!logger.js',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        statements: 80,
        lines: 80,
      },
    },
  
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
  
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ['/node_modules/', '/config/'],
  };