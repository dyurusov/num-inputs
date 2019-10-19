var testPathIgnorePatterns = [
  '/node_modules/',
  '<rootDir>/docs/',
  '\\.helpers?\\.[jt]sx?$',
];

module.exports = {
  projects: [
    {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testPathIgnorePatterns: testPathIgnorePatterns,
      testMatch: [
        '<rootDir>/src/**/*.(tsx|ts|jsxjs)',
      ],
    },
    {
      displayName: 'test',
      preset: 'ts-jest',
      testPathIgnorePatterns: testPathIgnorePatterns,
    },
  ],
};