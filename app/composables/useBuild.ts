import { useLocalStorage } from "@vueuse/core"
import type { Build } from "~/utils/discord/types"

export function useBuild(id: MaybeRefOrGetter<string>) {
    const idComputed = computed(() => `build:${toValue(id)}`)
    return useLocalStorage<Build>(idComputed, () => null, {
        serializer: {
            read: (v: any) => v ? JSON.parse(v) : null,
            write: (v: any) => JSON.stringify(v),
        },
    })
}

export function setBuild(id: string, build: Build) {
    localStorage.setItem(`build:${id}`, JSON.stringify(build))
}
