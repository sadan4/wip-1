<script setup lang="ts">
import { getUrlIndex, type IndexOptions } from '~/utils/archive'
import { getIndex, saveIndex } from '@/store/archives'
import { computedAsync, useAsyncQueue } from '@vueuse/core'
import { computed, ref } from 'vue'

const indexOptions = computed<IndexOptions<"timestamp">>(() => {
    return {
        fields: ["timestamp"],
        filters: {
            mimetype: "text/html",
            statuscode: "200",
        },
        // collapse: {
        //     timestamp: 6,
        // },
        // limit: 12,
    }
})

const URLS = [
    "https://discord.com/app",
    "https://canary.discord.com/app",
    "https://ptb.discord.com/app",
    "https://discordapp.com/app",
    "https://discordapp.com/",
    "https://canary.discordapp.com/",
    "https://ptb.discordapp.com/",
]

const queue = useAsyncQueue(URLS.map(href => async () => {
    const { hostname, pathname } = new URL(href)
    const key = hostname + pathname.replace(/\/$/, "")
    const existingIndex = await getIndex(key)
    if (existingIndex.length) return

    const response = await getUrlIndex(href, {
        fields: ["timestamp"],
        filters: {
            mimetype: "text/html",
            statuscode: "200",
        },
    })

    const index = response.map(entry => entry.timestamp).filter(timestamp => timestamp != null)
    await saveIndex(key, index)
    console.log("saved index %o with %o entries", key, index.length)
}))

const isFetching = ref(false)
// const index = computedAsync(() => getUrlIndex("https://discord.com/app", indexOptions.value), [], {
//     evaluating: isFetching,
//     onError: error => console.error(error),
// })
// const timestamps = computed(() => index.value.map(entry => entry.timestamp).filter(timestamp => timestamp != null))
const timestamps = computed(() => ['a'])
</script>

<template>
    <div class="picker">
        <div v-if="timestamps.length">
            <div v-for="timestamp in timestamps" :key="timestamp">
                {{ timestamp }}
            </div>
        </div>
        <div v-else-if="!isFetching">
            <p>No index found.</p>
        </div>
        <p v-if="isFetching">Fetching index...</p>
    </div>
</template>

<style scoped>
.picker {
    background-color: var(--color-background-d20);
    padding: 1.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--color-background-l20);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
