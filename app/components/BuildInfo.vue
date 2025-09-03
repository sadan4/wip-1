<script setup lang="ts">
import type { DiscordReleaseChannel } from '~/utils/discord/types'
import { scrapeForBuild, type ScrapeSource } from '~/utils/discord/assets'
import { ASSETS_BASE } from '~/utils/discord/constants'
import { isNonLiteral } from '~/utils/parser/query'

import { computedAsync, useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { fetchDiscordAsset } from '~/utils/discord/fetch'
import { getWebpackBootstrap } from '~/utils/parser/webpack'
import { parseScript } from '~/utils/parser/parse'
import { findWebpackChunk, saveBuildWebpack, saveFromScrapeResult } from '~/utils/discord/build'

const scrapeConfig = ref({
    releaseChannel: "stable" as DiscordReleaseChannel,
})
const sourceType = ref<ScrapeSource["type"]>("latest")

const source = computed<ScrapeSource | undefined>(() => {
    const { releaseChannel } = scrapeConfig.value
    const type = sourceType.value

    if (type === "latest") return { type: "latest", releaseChannel: releaseChannel }
    if (type === "archive") return { type: "archive", releaseChannel: releaseChannel }
})

const isFetching = ref(false)
const scrape = computedAsync(() => scrapeForBuild({ source: source.value }), null, {
    evaluating: isFetching,
    onError: error => console.error(error),
})

watch(scrape, async (scrape) => {
    if (!scrape) return
    saveFromScrapeResult(scrape)
})

const build = useBuild(() => scrape.value?.buildId ?? '')

watch(build, async (build) => {
    if (!build.webpack) {
        const result = await findWebpackChunk(build)
        if (!result) return

        await saveBuildWebpack(build, result.chunk, result.webpack)
    }
})
</script>

<template>
    <div>
        <!-- <ArchivePicker /> -->
        <select v-model="sourceType" value-key="value" :items="[
            { value: 'latest', label: 'Latest' },
            { value: 'archive', label: 'Archive' },
        ]" class="w-48" />
        <select v-model="scrapeConfig.releaseChannel" value-key="value" :items="[
            { value: 'stable', label: 'Stable' },
            { value: 'canary', label: 'Canary' },
            { value: 'ptb', label: 'PTB' },
        ]" class="w-48" />

        <div v-if="!scrape">
            <p>Loading...</p>
        </div>
        <div v-else>
            <label>Release Channel</label>
            &mdash;
            <code>{{ scrape.releaseChannel }}</code>
            <br>

            <details open>
                <summary>Entry Scripts</summary>
                <div v-for="scriptName in scrape.entryScripts">
                    <a :href="`${ASSETS_BASE}/${scriptName}`" target="_blank"><code>{{ scriptName }}</code>
                    </a>
                </div>
            </details>
            <br>

            <details>
                <summary>Environment Variables</summary>
                <div v-for="(value, key) in scrape.envVars" :key="key">
                    <label><code>{{ key }}</code></label>
                    &mdash;
                    <code v-if="isNonLiteral(value)">{{ value.expression }}</code>
                    <code v-else>{{ JSON.stringify(value) }}</code>
                </div>
            </details>
        </div>
        <div v-if="isFetching">
            <p>Fetching...</p>
        </div>
    </div>
</template>

<style scoped></style>
