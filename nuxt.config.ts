export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
    devtools: {
        enabled: true,
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                noImplicitAny: false,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                noUncheckedIndexedAccess: false,
            }
        }
    },

    alias: {
        "@ast/*": "../app/utils/ast/*"
    },

  modules: ['@nuxt/image'],
})
