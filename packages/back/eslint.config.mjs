import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist", "**/coverage"] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prettier cannot format but eslint can warn backticks
      quotes: ["warn", "double", { avoidEscape: true }],

      // If/for scope, force using curly bracket
      curly: ["warn", "all"],

      // Enforce strict equality (===) usage
      eqeqeq: "warn",

      "no-useless-concat": "warn",
      // "no-shadow": "warn",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-deprecated": "warn",

      // Old rules
      "no-empty": "warn", // Default is error
      "prefer-const": "warn", // Default is error
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Default is error
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/no-namespace": "off", // Default is error
      "@typescript-eslint/no-unused-vars": "warn", // Default is error
      "@typescript-eslint/switch-exhaustiveness-check": "warn",

      // This error types hides actual error
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",

      // Eslint 9 bug fix
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },

  {
    files: ["**/*.mjs"],
    rules: {
      // Prettier cannot format but eslint can warn backticks
      quotes: ["warn", "double", { avoidEscape: true }],
      // If/for scope, force using curly bracket
      curly: ["warn", "all"],
      "no-useless-concat": "warn",
      "no-shadow": "warn",
      "no-empty": "warn", // Default is error
      "prefer-const": "warn", // Default is error
    },
  },
);
