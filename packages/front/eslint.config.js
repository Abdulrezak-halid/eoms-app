import js from "@eslint/js";
import json from "@eslint/json";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/dist"] },
  {
    files: ["src/**/*.json"],
    language: "json/json",
    plugins: { json },
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/react-in-jsx-scope": "off", // Default is error

      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "react/jsx-no-bind": "warn",

      // Prettier cannot format but eslint can warn backticks
      quotes: ["warn", "double", { avoidEscape: true }],

      // If/for scope, force using curly bracket
      curly: ["warn", "all"],

      // Enforce strict equality (===) usage
      "eqeqeq": "warn",

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

      // Disable warning when promise cb is used for non-promise cb
      "@typescript-eslint/no-misused-promises": "off", // Default is error
      "@typescript-eslint/require-await": "warn", // Default is error
      "@typescript-eslint/no-unsafe-enum-comparison": "off", // Default is error

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
);
