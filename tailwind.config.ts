/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate'
import scrollbar from 'tailwind-scrollbar'

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: {
    files: [
      // all directories and extensions will correspond to your Nuxt config
      './components/**/*.{vue,js,jsx,mjs,ts,tsx}',
      './layouts/**/*.{vue,js,jsx,mjs,ts,tsx}',
      './pages/**/*.{vue,js,jsx,mjs,ts,tsx}',
      './plugins/**/*.{js,ts,mjs}',
      './composables/**/*.{js,ts,mjs}',
      './utils/**/*.{js,ts,mjs}',
      './{A,a}pp.{vue,js,jsx,mjs,ts,tsx}',
      './{E,e}rror.{vue,js,jsx,mjs,ts,tsx}',
      './app.config.{js,ts,mjs}',
      './app/spa-loading-template.html',
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [
    animate,
    scrollbar({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
  ],
}

export default config
