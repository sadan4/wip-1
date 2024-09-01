<script setup lang="ts" generic="T extends string">
import { Icon } from '@iconify/vue'
import {
    SelectContent,
    SelectPortal,
    SelectRoot,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from 'radix-vue'
import SelectEntry, { type SelectEntries } from './SelectEntry.vue'

const model = defineModel<T>()
const {
    entries,
    ariaLabel,
    placeholder,
} = withDefaults(defineProps<{
    entries: SelectEntries<T>,
    ariaLabel?: string,
    placeholder?: string,
}>(), {
    placeholder: 'Choose an option',
})

</script>

<template>
    <SelectRoot v-model="model">
        <SelectTrigger class="SelectTrigger" :aria-label="ariaLabel">
            <SelectValue :placeholder="placeholder" />
            <Icon icon="radix-icons:chevron-down" />
        </SelectTrigger>

        <SelectPortal>
            <SelectContent class="SelectContent" :side-offset="5">
                <SelectScrollUpButton class="SelectScrollButton">
                    <Icon icon="radix-icons:chevron-up" />
                </SelectScrollUpButton>

                <SelectViewport class="SelectViewport">
                    <SelectEntry v-for="(entry, index) in entries" :key="index" :entry="entry" />
                </SelectViewport>

                <SelectScrollDownButton class="SelectScrollButton">
                    <Icon icon="radix-icons:chevron-down" />
                </SelectScrollDownButton>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>

<style scoped>
button {
    all: unset;
}

.SelectTrigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    padding: 0 15px;
    font-size: 0.9em;
    line-height: 1;
    height: 2rem;
    gap: .5rem;
    background-color: var(--color-background-d30);
    color: var(--color-text-l30);
    cursor: pointer;
}

.SelectTrigger:focus {
    box-shadow: 0 0 0 2px var(--color-accent);
}

.SelectTrigger[data-placeholder] {
    color: var(--color-disabled);
}

:deep(.SelectContent) {
    overflow: hidden;
    background-color: var(--color-background-d10);
    border-radius: 0.25rem;
    border: 1px solid var(--color-background-d20);
}

:deep(.SelectViewport) {
    padding: 0.5rem;
}

:deep(.SelectScrollButton) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.75rem;
    background-color: var(--color-accent-dark);
    color: var(--color-accent);
    cursor: default;
}
</style>
