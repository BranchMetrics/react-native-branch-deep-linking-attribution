module.exports = {
  env: {
    'jest/globals': true,
  },
  root: true,
  extends: ['@react-native-community'],
  plugins: ['jest'],
  rules: {
    "array-bracket-spacing": 0,
    "no-console": 0,
    'comma-dangle': 0,
    'object-curly-spacing': 0,
    'no-unused-vars': 2,
    "semi": 0,
    "quotes": [2, "single", "avoid-escape"],
    "eqeqeq": 0,
    "keyword-spacing": 0,
    "no-extra-semi": 0,
    "one-line": 0,
    "curly": 0,
    "no-shadow": 0,
    "prettier/prettier": 0,
    "no-trailing-spaces": 0,
    "dot-notation": 0
  }
}
