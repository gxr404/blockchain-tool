// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
// import ViteComponents from 'unplugin-vue-components/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    'unplugin-icons/nuxt',
    '@element-plus/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    preference: 'dark',
    classSuffix: '',
  },
  // app: {
  //   // head
  //   head: {
  //     title: 'Element Plus + Nuxt 3',
  //     meta: [
  //       { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: 'ElementPlus + Nuxt3',
  //       },
  //     ],
  //     link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  //   }
  // },

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
    plugins: [
      // ViteComponents({
      //   resolvers: [
      //     IconsResolver({
      //       /* options */
      //       // prefix: false,
      //       // enabledCollections: ['mdi'],
      //     }),
      //   ],
      // }),
      // Icons({
      //   autoInstall: true,
      // }),
    ],
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        // add it
        // types: ['element-plus/types/vue'],
      },
    },
  },
  elementPlus: {
    // icon: 'ElIcon',
  },
})
