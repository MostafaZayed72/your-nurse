import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  modules: [
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    'vuetify-nuxt-module',
    '@nuxt/icon'
  ],

  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
},

  compatibilityDate: '2024-09-25'
})