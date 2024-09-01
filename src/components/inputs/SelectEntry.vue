<script setup lang="ts" generic="T extends string">
import { Icon } from '@iconify/vue'
import {
    SelectGroup,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectLabel,
    SelectSeparator,
} from 'radix-vue'

export type SelectEntry<T> =
    | { type: 'label', label: string }
    | { type: 'group', children: SelectEntry<T>[] }
    | { type: 'item', value: T, label: string, disabled?: boolean }
    | { type: 'separator' }
export type SelectEntries<T> = SelectEntry<T>[]

defineProps<{
    entry: SelectEntry<T>
}>()
</script>

<template>
    <SelectLabel v-if="entry.type === 'label'" class="SelectLabel">
        {{ entry.label }}
    </SelectLabel>
    <SelectSeparator v-else-if="entry.type === 'separator'" class="SelectSeparator" />
    <SelectGroup v-else-if="entry.type === 'group'">
        <SelectEntry v-for="(entry, index) in entry.children" :key="index" :entry="entry" />
    </SelectGroup>
    <SelectItem v-else-if="entry.type === 'item'" class="SelectItem" :value="entry.value" :disabled="entry.disabled">
        <SelectItemIndicator class="SelectItemIndicator">
            <Icon icon="radix-icons:check" />
        </SelectItemIndicator>
        <SelectItemText>
            {{ entry.label }}
        </SelectItemText>
    </SelectItem>
</template>

<style scoped>
.SelectItem {
    font-size: 0.9em;
    line-height: 1;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 0.5rem 1.5rem;
    position: relative;
    user-select: none;
    cursor: pointer;
}

.SelectItem[data-disabled] {
    color: var(--color-disabled);
    pointer-events: none;
}

.SelectItem[data-highlighted],
.SelectItem:hover {
    outline: none;
    background-color: var(--color-background-l5);
    color: var(--color-text-l30);
}

.SelectLabel {
    padding: 0 1.5rem;
    font-size: .8em;
    line-height: 2;
    color: var(--color-text-d20);
}

.SelectSeparator {
    height: 1px;
    background-color: var(--color-background-l20);
    margin: .5rem;
}

.SelectItemIndicator {
    position: absolute;
    left: 0;
    width: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
