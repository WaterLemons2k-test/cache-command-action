module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  "rules": {
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
			'error',
			'single'
		],
    'semi': [
			'error',
			'always'
		]
  },
  "env": {
    "node": true,
    "es6": true
  }
};