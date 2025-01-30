<script setup lang="ts">
import { ref, computed } from 'vue'
import { hash160 } from '@/utils/hash'
import { checkHex } from '@/utils/common'

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
  <div class="p-10">
    <h1 class="text-lg font-bold">Hash160</h1>
    <p class="mt-4">在bitcoin里用于:</p>
    <ul class="pl-4">
      <li class="list-disc">在转换成address之前, 压缩公钥</li>
      <li class="list-disc">bitcoin交易script中, 压缩公钥</li>
    </ul>
    <p><code>Hash160 = RIPEMD-160(SHA-256(data))</code></p>
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
        <el-alert type="success" :closable="false">
          <p class="flex items-center">
            <span class="font-bold min-w-fit">First Sha256</span>:
            <radix-box radix-prefix="0x" :num-data="hash160Result.firstSha256" />
          </p>
        </el-alert>
        <div class="mt-2">
          <el-alert type="success" :closable="false" class="mt-2">
            <p class="flex items-center">
              <span class="font-bold min-w-fit">Hash Result(ripemd160)</span>:
              <radix-box radix-prefix="0x" :num-data="hash160Result.ripemd160" />
            </p>
          </el-alert>
        </div>
      </template>
    </template>
  </div>
</template>
