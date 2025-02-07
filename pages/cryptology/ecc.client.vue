<script setup lang="ts">
import { Link } from '@element-plus/icons-vue'
</script>

<template>
  <div>
    <div class="pt-6 px-6">
      <a
        class="underline text-[#409eff] hover:text-[#347ecc]"
        target="_blank"
        href="https://bitcoin.heapup.tech/cryptology/ecc/ecc"
      >
        <Link class="w-[16px] h-[16px] inline-block align-middle" />
        <span class="font-bold">&nbsp;建议看 bitcoin ninja 的ecc</span>
      </a>
    </div>
    <div class="flex flex-wrap gap-6 p-6">
      <cryptology-ecc-base />
      <cryptology-finite-field-ecc />
    </div>
  </div>
</template>
