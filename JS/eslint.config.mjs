import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([ { plugins: { js }, languageOptions: { globals: { ...globals.browser, ...globals.node } } }, ]);
