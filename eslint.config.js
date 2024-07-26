const rnx = require("@rnx-kit/eslint-plugin");
module.exports = [
  ...rnx.configs.recommended,
  {
    rules: {
      "@rnx-kit/no-const-enum": "error",
      "@rnx-kit/no-export-all": "error",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];