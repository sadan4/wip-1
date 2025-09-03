import { get, set, setMany } from "idb-keyval"

const blobKey = (id: string) => `blobs/${id}`

export async function getBlob(id: string): Promise<Blob | null> {
    const value = await get(blobKey(id))
    return value ?? null
}

/** Saves a blob */
export async function saveBlob(id: string, blob: Blob): Promise<void> {
    const key = blobKey(id)
    await set(key, blob)
}

export async function saveBlobs(entries: [string, Blob][]): Promise<void> {
    await setMany(entries.map(([id, blob]) => [blobKey(id), blob]))
}
