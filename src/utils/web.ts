export function readBlobAsArrayBuffer(blob: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.onerror = reject
        reader.readAsArrayBuffer(blob)
    })
}

export async function sha256(data: BufferSource) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const bytes = new Uint8Array(hashBuffer)
    const hexBytes = Array.from({ length: hashBuffer.byteLength }, (_, i) => bytes[i].toString(16).padStart(2, "0"))
    return hexBytes.join("")
}
