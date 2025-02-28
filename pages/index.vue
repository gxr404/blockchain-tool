<script setup lang="ts">
definePageMeta({
  // redirect: '/hash/hash256',
  layout: 'default',
})
</script>
<template>
  <div>
    <div>
      <div class="w-[40px]"><img src="/logo.png" alt="Logo" /></div>
      BlockChain Tool
    </div>

    {{ $colorMode.value }}

    <button @click="$colorMode.preference = 'dark'">color switch</button>
  </div>
</template>
