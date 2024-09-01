import { ASSETS_BASE, CHANNEL_ORIGINS, type DiscordReleaseChannel } from "./constants"
import { $fetch } from "./proxy"
import { getEnvBuildVars } from "../parser"
import { parse } from "acorn"

export type ScrapeSource =
| {
    type: "latest"
    releaseChannel: DiscordReleaseChannel
}
| {
    type: "archive"
    releaseChannel: DiscordReleaseChannel
    // something else?
}
export type ScrapeOptions = {
    source: ScrapeSource
}

const DEFAULT_SCRAPE_OPTIONS: ScrapeOptions = {
    source: { type: "latest", releaseChannel: 'stable' }
}

export async function scrapeForBuild(options: Partial<ScrapeOptions> = {}) {
    const fullOptions = { ...DEFAULT_SCRAPE_OPTIONS, ...options }

    if (fullOptions.source.type !== "latest") throw new Error("TODO")

    const { releaseChannel } = fullOptions.source
    const blob = await $fetch(`${CHANNEL_ORIGINS[releaseChannel]}/app`, true)
    if (blob.type !== 'text/html') throw new Error('Not a text/html response')

    const html = await blob.text()
    const doc = new DOMParser().parseFromString(html, blob.type)
    const scriptEls = [...doc.querySelectorAll("script")]

    const envScriptEl = scriptEls.find(scriptEl => scriptEl.textContent?.includes("window.GLOBAL_ENV ="))
    if (!envScriptEl) throw new Error("Could not find window.GLOBAL_ENV script")

    const envVars = getEnvBuildVars(envScriptEl.textContent!)

    const entryScriptNames = scriptEls
        .filter(scriptEl => scriptEl.src.startsWith(location.origin))
        .map(scriptEl => scriptEl.src.slice(location.origin.length))
        .filter(pathname => pathname.startsWith("/assets/"))
        .map(pathname => pathname.replace("/assets/", ""))

    // console.log("parsing entry script")
    // const firstEntryScript = await fetchDiscordAsset(entryScriptNames[0]).then(blob => blob.text())
    // console.time("parseEntryScript")
    // parser.parse(firstEntryScript)
    // parse(firstEntryScript, { ecmaVersion: "latest" })
    // console.timeEnd("parseEntryScript")

    return {
        releaseChannel,
        envVars,
        entryScripts: entryScriptNames,
    }
}

// TODO: https://archive.org/developers/wayback-cdx-server.html

// export function useDiscordApp(options: MaybeRefOrGetter<DiscordAppOptions> = DEFAULT_APP_OPTIONS) {
//     return useAsyncState()
// }

export async function fetchDiscordAsset(asset: string) {
    const blob = await $fetch(`${ASSETS_BASE}/${asset}`, true)

    return blob
}
