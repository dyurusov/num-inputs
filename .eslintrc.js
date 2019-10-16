module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // 'standard'
    'eslint:recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    // semi: ['error', 'always'],
    // 'comma-dangle': ['error', 'always-multiline'],
    // 'no-multiple-empty-lines': ['error', { max: 2 }]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        // 'standard'
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
};
