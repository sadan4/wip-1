export function toProxyUrl(url: string) {
    return 'https://corsproxy.io/?' + encodeURIComponent(url)
}

export function fetchBlob(url: string, proxy = false) {
    return fetch(proxy ? toProxyUrl(url) : url).then(res => res.blob())
}
