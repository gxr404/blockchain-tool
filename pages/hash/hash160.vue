<script setup lang="ts">
import { ref, computed } from 'vue'

const hexData = ref('')
const loading = ref(false)

const hash160Result = computed(() => {
  const result = {
    isError: true,
    firstSha256: '',
    ripemd160: '',
    errMsg: 'unknown error',
  }
  try {
    checkHex(hexData.value)
    const _hash160Result = hash160(hexData.value)
    result.isError = false
    result.firstSha256 = _hash160Result.firstSha256
    result.ripemd160 = _hash160Result.ripemd160
  } catch (e) {
    if (e instanceof Error) {
      result.errMsg = e.message
    }
  }
  return result
})
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Hash160" :tag-data="['bitcoin']" title-large>
      <template #description>
        <p>在bitcoin里用于:</p>
        <ul class="pl-4">
          <li class="list-disc">在转换成address之前, 压缩公钥</li>
          <li class="list-disc">bitcoin交易script中, 压缩公钥</li>
        </ul>
        <p><code>Hash160 = RIPEMD-160(SHA-256(data))</code></p>
      </template>

      <!-- <block-info-box :block-info="example1.block"></block-info-box> -->
      <div class="py-4">
        <p class="py-2">Data (Hex-16进制):</p>
        <el-input
          style="width: 800px"
          v-model="hexData"
          :disabled="loading"
          :rows="6"
          :show-word-limit="true"
          placeholder="Please input"
          type="textarea"
        />
      </div>
      <template v-if="hexData">
        <el-alert type="error" :closable="false" v-if="hash160Result.isError">
          <p><span class="font-bold">Error</span>: {{ hash160Result.errMsg }}</p>
        </el-alert>
        <template v-else>
          <p class="flex items-center">
            <span class="font-bold min-w-fit pr-4">First Sha256:</span>
            <radix-box default-radix="0x" :num-data="hash160Result.firstSha256" />
          </p>
          <div class="mt-2">
            <p class="flex items-center">
              <span class="font-bold min-w-fit pr-4">Hash Result(ripemd160):</span>
              <radix-box default-radix="0x" :num-data="hash160Result.ripemd160" />
            </p>
          </div>
        </template>
      </template>
    </content-card>
  </div>
</template>
