import { readFileSync } from "node:fs";
import { join } from "node:path";

export function makeGetFile(__dirname: string) {
    return function getFile(asset: string): string {
        return readFileSync(join(__dirname, "__test__", asset), "utf-8");
    }
}
