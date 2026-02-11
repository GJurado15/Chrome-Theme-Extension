import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  // Ignore vendor/minified output everywhere
  {
    ignores: ["node_modules/**", "**/*.min.js", "jszip.min.js"]
  },

  js.configs.recommended,
  prettier,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        chrome: "readonly",
        JSZip: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-var": "off",
      "prefer-const": "warn"
    }
  }
];
