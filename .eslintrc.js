module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  "rules": {
    'linebreak-style': [
      'error',
      'unix'
    ]
  },
  "env": {
    "node": true,
    "es6": true
  }
};