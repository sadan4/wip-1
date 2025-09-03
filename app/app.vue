<template>
    <!-- <UApp> -->
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <!-- </UApp> -->
</template>
<style>
@layer base {
    @media (prefers-color-scheme: dark) {
        body {
            background-color: #1a1b26;
            color: #c0caf5;
        }
        a {
            color: oklch(0.719 0.1322 264.2);
            &:visited {
                color: #9d7cd8;
            }
        }
    }
}
</style>
