<script setup lang="ts">
import { init } from './utils/localforage'

import './assets/style.scss'

const layout = 'content'
// const route = useRoute()

onMounted(() => {
  init()
  // console.log(route.hash)
  // if (route.hash) {
  //   const el = document.getElementById(route.hash.replace('#', ''))
  //   if (el) {
  //     console.log('??', el.scrollIntoView)
  //     nextTick(() => el.scrollIntoView())
  //   }
  // }
})

// window.onload = function () {}
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtLoadingIndicator color="#409eff" :height="3" :throttle="0" />
    <NuxtPage />
  </NuxtLayout>
</template>
