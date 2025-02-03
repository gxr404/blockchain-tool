// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@element-plus/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    '/bitcoin/rpc/**': { proxy: process.env.BTC_RPC_API },
  },
  vite: {
    optimizeDeps: {
      include: ['dayjs'],
    },
  },
})
