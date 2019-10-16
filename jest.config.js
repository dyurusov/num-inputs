module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
    '\\.helpers?\\.[jt]sx?$',
  ],
};