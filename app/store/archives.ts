import { get, set } from "idb-keyval"
import { getBlob, saveBlob } from "./blobs"

const archiveKey = (key: string, timestamp: string) => `archives/${key}/${timestamp}`
const indexKey = (key: string) => `archives-index/${key}`

export async function getIndex(key: string): Promise<string[]> {
    const value = await get(indexKey(key))
    return value ?? []
}

export async function saveIndex(key: string, index: string[]): Promise<void> {
    await set(indexKey(key), index)
}

export async function getArchive(key: string, timestamp: string): Promise<Blob | null> {
    return getBlob(archiveKey(key, timestamp))
}
export async function saveArchive(key: string, timestamp: string, blob: Blob): Promise<void> {
    await saveBlob(archiveKey(key, timestamp), blob)
}
