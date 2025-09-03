import { getBlob, saveBlob } from "~/store/blobs"
import { ASSETS_BASE, CHANNEL_ORIGINS } from "./constants"
import type { DiscordReleaseChannel } from "./types"

export function fetchDiscordApp(releaseChannel: DiscordReleaseChannel): Promise<Blob> {
    return fetchBlob(`${CHANNEL_ORIGINS[releaseChannel]}/app`, true)
}

export async function fetchDiscordAsset(asset: string): Promise<Blob> {
    const cached = await getBlob(asset)
    if (cached) return cached

    const blob = await fetchBlob(`${ASSETS_BASE}/${asset}`, true)
    await saveBlob(asset, blob)

    return blob
}
