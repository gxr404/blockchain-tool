<script setup lang="ts">
import { init } from './utils/localforage'

import './assets/style.css'

const layout = "content"

onMounted(() => {
  init()
})
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

