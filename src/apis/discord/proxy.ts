export function getProxyUrl(url: string) {
    return 'https://corsproxy.io/?' + encodeURIComponent(url)
}

export function $fetch(url: string, proxy = false) {
    return fetch(proxy ? getProxyUrl(url) : url).then(res => res.blob())
}
