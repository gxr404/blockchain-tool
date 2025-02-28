<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css'

import { init } from './utils/localforage'

import './assets/style.scss'

const route = useRoute()

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

const layoutName = computed(() => {
  return route.meta.layout || 'content'
})

// window.onload = function () {}
</script>

<template>
  <div class="bg-[var(--bg)]">
    <NuxtLayout :name="layoutName">
      <NuxtLoadingIndicator color="#409eff" :height="3" :throttle="0" />
      <!-- <el-config-provider> -->
      <NuxtPage />
      <!-- </el-config-provider> -->
    </NuxtLayout>
  </div>
</template>
