<script setup lang="ts">
import { initParser } from '@/apis/parser'
import BuildInfo from '@/components/BuildInfo.vue'
import { useAsyncState } from '@vueuse/core'

const { state: isParserReady, error: parserError } = useAsyncState(initParser().then(() => true), false)
</script>

<template>
  <main>
    <div v-if="parserError">
      <p>Failed to initialize parser</p>
    </div>
    <div v-else-if="!isParserReady">
      <p>Loading parser...</p>
    </div>
    <div v-else>
      <BuildInfo />
    </div>
  </main>
</template>
