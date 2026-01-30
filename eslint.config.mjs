// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      // allow both type and interface
      "@typescript-eslint/consistent-type-definitions": "off",

      // allow both Array<T> and T[]
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-dynamic-delete": "off",

      // example of other rules you can keep
      "no-console": "warn",
    },
  },
);
