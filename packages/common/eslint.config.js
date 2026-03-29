import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    parser: tseslint.parser,
    parserOptions: {
      project: ["./tsconfig.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Prettier cannot format but eslint can warn backticks
    quotes: ["warn", "double", { avoidEscape: true }],

    // If/for scope, force using curly bracket
    curly: ["warn", "all"],

    "no-useless-concat": "warn",
    // "no-shadow": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-deprecated": "warn",

    // Old rules
    "no-empty": "warn", // Default is error
    "prefer-const": "warn", // Default is error
    "@typescript-eslint/no-explicit-any": "warn", // Default is error
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/no-namespace": "off", // Default is error
    "@typescript-eslint/no-unused-vars": "warn", // Default is error
    "@typescript-eslint/switch-exhaustiveness-check": "warn",

    // Eslint 9 bug fix
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
  },
});
