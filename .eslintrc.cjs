module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
    node: true
  },
  extends: [
    'standard'
  ],
  overrides: [
    {
      files: ['public/**/*.js'],
      env: {
        browser: true
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 'off'
  }
};



