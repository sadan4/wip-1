import { get, set } from "idb-keyval"

const blobKey = (hash: string) => `blobs/${hash}`

export async function getBlob(id: string): Promise<Blob | null> {
    const value = await get(blobKey(id))
    return value ?? null
}

/** Saves a blob */
export async function saveBlob(id: string, blob: Blob): Promise<void> {
    const key = blobKey(id)
    const existing = await get(key)
    if (!existing) await set(key, blob)
}
