import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused variables
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // Allow explicit any
      "@typescript-eslint/no-explicit-any": "off",
      
      // Allow unused imports
      "@typescript-eslint/no-unused-imports": "off",
    },
  },
];

export default eslintConfig;
