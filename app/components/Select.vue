<script setup lang="ts" generic="Value extends string">
type Item = { value: Value, label: string }

const { items, value: providedValue } = defineProps<{
    items: Item[],
    value?: Value,
}>()
const defaultValue = providedValue ?? items[0]!.value

const value = defineModel<Value>()
value.value = defaultValue
</script>

<template>
    <select v-model="value">
        <option v-for="{ value, label } in items" :key="value" :value="value">
            {{ label }}
        </option>
    </select>
</template>
