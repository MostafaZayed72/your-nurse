import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  supabase: {
    redirect: false,
    url:"https://nvhadtslthjknimxnsjg.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52aGFkdHNsdGhqa25pbXhuc2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2ODY0NzksImV4cCI6MjA0MzI2MjQ3OX0.9elgAbob5JqVwDqf5jni6NZfd7tBOgmLV08kXea_cK0",
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
  modules: [
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    'vuetify-nuxt-module',
    '@nuxt/icon',
    '@nuxtjs/supabase'
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