module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jsdoc",
    "typescript-sort-keys",
  ],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  rules: {
    'camelcase': 0,
    "@typescript-eslint/camelcase": ["error", { "properties": "never" }],
    "@typescript-eslint/no-unused-vars": "error",
    "typescript-sort-keys/interface": 2,
    "typescript-sort-keys/string-enum": 2,
    "no-await-in-loop": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "no-restricted-syntax": 2,
    "max-len": ["error", { "code": 110 }],
    "quotes": ["error", "single"],
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
    "complexity": ["error", 10],
    "import/prefer-default-export": 0,
    "no-console": "error",
    "no-plusplus": 0,

    "jsdoc/require-description": 2,
    "jsdoc/require-description-complete-sentence": 2,
    "jsdoc/require-example": 0,
    "jsdoc/require-hyphen-before-param-description": 0,
    "jsdoc/require-jsdoc": 2, // Recommended
    "jsdoc/require-param": 0, // Recommended
    "jsdoc/require-param-description": 0, // Recommended
    "jsdoc/require-param-name": 0, // Recommended
    "jsdoc/require-param-type": 0, // Recommended
    "jsdoc/require-returns": 0, // Recommended
    "jsdoc/require-returns-check": 0, // Recommended
    "jsdoc/require-returns-description": 0, // Recommended
    "jsdoc/require-returns-type": 0, // Recommended
    "jsdoc/valid-types": 0 // Recommended
  }
};