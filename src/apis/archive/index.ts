import { getProxyUrl } from "../discord/proxy"

export type IndexKey =
    | "urlkey"
    | "timestamp"
    | "original"
    | "mimetype"
    | "statuscode"
    | "digest"
    | "length"
export type IndexEntry = Record<IndexKey, string | null>

type IndexTable = [IndexKey[], ...(string | null | undefined)[][]]
function getCdxUrl(query: URLSearchParams) {
    return getProxyUrl(`https://web.archive.org/cdx/search/cdx?${query.toString()}`)
}

export type IndexOptions<Filter extends IndexKey = IndexKey> = {
    fields?: Filter[]
    filters?: Partial<Record<IndexKey, string>>
    limit?: number
    offset?: number
    collapse?: Partial<Record<IndexKey, boolean | number>>
    from?: string
    to?: string
}

/** https://archive.org/developers/wayback-cdx-server.html */
export async function getUrlIndex<Filter extends IndexKey = IndexKey>(url: string, options: IndexOptions<Filter> = {}) {
    const query = new URLSearchParams({ url, output: "json" })
    if (options.fields) query.append("fl", options.fields.join(","))
    if (options.limit) query.append("limit", `${options.limit}`)
    if (options.offset) query.append("offset", `${options.offset}`)
    if (options.filters) for (const [key, value] of Object.entries(options.filters)) query.append("filter", `${key}:${value}`)
    if (options.collapse) for (const [key, value] of Object.entries(options.collapse))
        if (value == null && value !== false) query.append("collapse", value === true ? key : `${key}:${value}`)
    if (options.from) query.append("from", options.from)
    if (options.to) query.append("to", options.to)

    const table: IndexTable = await fetch(getCdxUrl(query)).then(res => res.json())

    const entries = table.slice(1).map(row => Object.fromEntries(row.map((value, i) => [table[0][i], value ?? null]))) as Pick<IndexEntry, Filter>[]

    return entries
}
