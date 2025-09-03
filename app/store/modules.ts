import type { WebpackModules } from "~/utils/parser/webpack"
import { getBlob, saveBlob, saveBlobs } from "./blobs"
import { stringify } from "~/utils/parser/parse"

const moduleKey = (chunk: string, id: string) => `modules/${chunk}/${id}`

export function getModule(chunk: string, id: string) {
    return getBlob(moduleKey(chunk, id))
}

// export function saveModule(chunk: string, id: string, module: Blob) {
//     return saveBlob(moduleKey(chunk, id), module)
// }

export function saveWebpackModules(chunk: string, entries: WebpackModules) {
    return saveBlobs(Object.entries(entries).map(([id, expression]) => [
        moduleKey(chunk, id),
        new Blob([stringify(expression)], { type: 'application/javascript' }),
    ]))
}
