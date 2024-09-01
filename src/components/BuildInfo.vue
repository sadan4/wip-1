<script setup lang="ts">

import { scrapeForBuild, type ScrapeSource } from '@/apis/discord/assets'
import { ASSETS_BASE, type DiscordReleaseChannel } from '@/apis/discord/constants'
import { isNonLiteral } from '@/apis/parser'
import { computedAsync } from '@vueuse/core'
import { computed, ref } from 'vue'
import Select from './inputs/Select.vue'

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
const app = computedAsync(() => scrapeForBuild({ source: source.value }), null, {
    evaluating: isFetching,
    onError: error => console.error(error),
})
</script>

<template>
    <div>
        <Select v-model="sourceType" :entries="[{
            type: 'label',
            label: 'Source',
        }, {
            type: 'group',
            children: [
                { type: 'item', value: 'latest', label: 'Latest' },
                { type: 'item', value: 'archive', label: 'Archive' },
            ]
        }]" />
        <Select v-model="scrapeConfig.releaseChannel" :entries="[{
            type: 'label',
            label: 'Release Channel',
        }, {
            type: 'group',
            children: [
                { type: 'item', value: 'stable', label: 'Stable' },
                { type: 'item', value: 'canary', label: 'Canary' },
                { type: 'item', value: 'ptb', label: 'PTB' },
            ],
        }]" />

        <div v-if="!app">
            <p>Loading...</p>
        </div>
        <div v-else>
            <label>Release Channel</label>
            &mdash;
            <code>{{ app.releaseChannel }}</code>
            <br>

            <details open>
                <summary>Entry Scripts</summary>
                <div v-for="scriptName in app.entryScripts">
                    <a :href="`${ASSETS_BASE}/${scriptName}`" target="_blank"><code>{{ scriptName }}</code>
                    </a>
                </div>
            </details>
            <br>

            <details>
                <summary>Environment Variables</summary>
                <div v-for="(value, key) in app.envVars" :key="key">
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
