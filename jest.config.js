var testPathIgnorePatterns = [
  '/node_modules/',
  '<rootDir>/dist/',
  '\\.helpers?\\.[jt]sx?$',
];

module.exports = {
  projects: [
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testPathIgnorePatterns: testPathIgnorePatterns,
    },
    {
      displayName: 'test',
      preset: 'ts-jest',
      testPathIgnorePatterns: testPathIgnorePatterns,
    },
  ],
};