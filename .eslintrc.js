module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
	'linebreak-style': [
		'error',
		'unix'
	],
	'semi': [
		'error',
		'always'
	],
	'space-before-function-paren': [
		'error',
		'never'
	]
  }
}
