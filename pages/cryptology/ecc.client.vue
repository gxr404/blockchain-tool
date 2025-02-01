<script setup lang="ts">
import { Link } from '@element-plus/icons-vue'
</script>

<template>
  <div>
    <div class="pt-6 px-6">
      <el-link
        :icon="Link"
        type="primary"
        href="https://bitcoin.heapup.tech/cryptology/ecc/ecc"
        target="_blank"
      >
        <span class="font-bold">&nbsp;建议看 bitcion ninja 的ecc</span>
      </el-link>
    </div>
    <div class="flex flex-wrap gap-6 p-6">
      <cryptology-ecc-base />
      <cryptology-finite-field-ecc />
    </div>
  </div>
</template>
