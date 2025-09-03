import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
const __dirname = import.meta.dirname;
export default defineConfig({
    resolve: {
        alias: {
            "@ast": resolve(__dirname, "./app/utils/ast"),
            "~": resolve(__dirname, "./app")
        }
    }
})
