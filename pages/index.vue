<script setup lang="ts">
definePageMeta({
  // redirect: '/hash/hash256',
  layout: 'default',
})
</script>
<template>
  <menu-group />
  <div class="flex items-center justify-center flex-col min-h-full py-[60px]">
    <div class="flex items-center justify-center flex-col">
      <div class="w-[100px]"><img src="/logo.png" alt="Logo" /></div>
      <span class="font-bold text-[20px] mt-2">BlockChain Tool</span>
    </div>
    <div class="flex mt-2 gap-4 flex-wrap max-w-[800px] pt-[20px] pb-[60px] justify-center">
      <home-menu-item v-for="item in routeList" :key="item.id" :data="item" />
    </div>
  </div>
</template>
