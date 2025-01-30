<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { getRandomBlockHeader, getRandomTransaction } from '@/utils/rpcApi'
import RadixBox from '@/components/RadixBox.vue'

import 'element-plus/es/components/message/style/css'

interface RandomInfo {
  block?: {
    height: number
    hash: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info?: any
    headerHex?: string
  }
  txId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  txHex?: any
}

interface InfoSite {
  block: Record<string, string>
  tx?: Record<string, string>
}


definePageMeta({
  alias: '/hash256'
})

const isRandomFlag = ref(false)
const hexData = ref('')
const loading = ref(false)
const randomInfo = ref<RandomInfo>({})
const infoSite = ref<InfoSite>({
  block: {},
  tx: {},
})
const hash256Result = computed(() => {
  const result = {
    isError: true,
    firstSha256: '',
    secondSha256: '',
    errMsg: 'unknown error',
  }
  try {
    checkHex(hexData.value)
    const _hash256Result = hash256(hexData.value)
    result.isError = false
    result.firstSha256 = _hash256Result.firstSha256
    result.secondSha256 = _hash256Result.secondSha256
  } catch (e) {
    if (e instanceof Error) {
      result.errMsg = e.message
    }
  }
  return result
})
let currentLoad = ''

watch(hexData, () => {
  if (isRandomFlag.value) {
    resetRandomInfo()
    // currentLoad = ''
  }
})

// const exampleTransaction = getExample(example1)

async function loadingWarp(cb: () => Promise<unknown>) {
  loading.value = true
  await cb()
  loading.value = false
}

async function randomTransaction() {
  isRandomFlag.value = false
  currentLoad = 'tx'
  const result = await getRandomTransaction()
  console.log('result', result)
  if (!result || !result?.txHex) {
    ElMessage.error('Server Error')
    return
  }
  randomInfo.value = result
  if (typeof result.txHex == 'string') {
    hexData.value = result.txHex
  }
  // infoSite.value
  infoSite.value.block = btcInfoSite.block(result.block.height, result.block.hash)
  infoSite.value.tx = btcInfoSite.transaction(result.txId)
  nextTick(() => {
    isRandomFlag.value = true
  })
}

async function randomBlockHeader() {
  isRandomFlag.value = false
  currentLoad = 'blockHeader'
  const result = await getRandomBlockHeader()
  if (!result || !result?.block?.headerHex) {
    ElMessage.error('Server Error')
    return
  }
  randomInfo.value = {
    block: {
      ...result.block,
    },
  }
  if (typeof result?.block?.headerHex == 'string') {
    hexData.value = result.block.headerHex
  }
  infoSite.value = {
    block: {
      ...btcInfoSite.block(result.block.height, result.block.hash),
    },
  }
  infoSite.value.block = btcInfoSite.block(result.block.height, result.block.hash)
  nextTick(() => {
    isRandomFlag.value = true
  })
}

function resetRandomInfo() {
  isRandomFlag.value = false
  randomInfo.value = {}
  infoSite.value.block = {}
  infoSite.value.tx = {}
}
</script>

<template>
  <div class="p-10">
    <h1 class="text-lg font-bold">Hash256</h1>
    <p class="mt-4">双层SHA-256。用于BlockHeader、Transaction，以及大多数需要在比特币中hash</p>
    <p><code>Hash256 = SHA-256(SHA-256(data))</code></p>
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
      <el-alert type="error" :closable="false" v-if="hash256Result.isError">
        <p><span class="font-bold">Error</span>: {{ hash256Result.errMsg }}</p>
      </el-alert>
      <template v-else>
        <el-alert type="success" :closable="false">
          <p class="flex items-center">
            <span class="font-bold min-w-fit">First Sha256</span>:
            <radix-box radix-prefix="0x" :num-data="hash256Result.firstSha256" />
          </p>
        </el-alert>
        <div class="mt-2">
          <el-alert type="success" :closable="false" class="mt-2">
            <p class="flex items-center">
              <span class="font-bold min-w-fit">Hash Result</span>:
              <radix-box radix-prefix="0x" :num-data="hash256Result.secondSha256" />
            </p>
          </el-alert>
        </div>
      </template>
    </template>
    <div class="mt-4">
      <el-button
        @click="loadingWarp(randomBlockHeader)"
        :loading="currentLoad === 'blockHeader' && loading"
        :disabled="currentLoad !== 'blockHeader' && loading"
      >
        Random Block Header
      </el-button>
      <el-button
        @click="loadingWarp(randomTransaction)"
        :loading="currentLoad === 'tx' && loading"
        :disabled="currentLoad !== 'tx' && loading"
      >
        Random Transaction Data
      </el-button>
    </div>
    <div class="border p-4 mt-4 rounded" v-if="isRandomFlag">
      <el-descriptions title="Random Info" :column="1">
        <el-descriptions-item label="Block height:" label-class-name="font-bold">
          <span class="text-gray-400 break-all">{{ randomInfo?.block?.height }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="Block hash:" label-class-name="font-bold">
          <span class="text-gray-400 break-all">{{ randomInfo?.block?.hash }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="block hash第三方网站查看:" label-class-name="font-bold">
          <span class="text-gray-400 break-all">
            <a
              target="_blank"
              v-for="(item, key) in infoSite.block"
              :key="key"
              class="hover:text-[#409eff] underline cursor-pointer px-2"
              :href="item"
            >
              <el-icon class="align-middle"><Link /></el-icon> {{ key }}
            </a>
          </span>
        </el-descriptions-item>
        <el-descriptions-item v-if="randomInfo?.txHex" label="txHex:" label-class-name="font-bold">
          <span class="text-gray-400 break-all">{{ randomInfo?.txHex }}</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="randomInfo?.txId" label="txId:" label-class-name="font-bold">
          <span class="text-gray-400 break-all">{{ randomInfo?.txId }}</span>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="randomInfo?.txId"
          label="tx hash第三方网站查看:"
          label-class-name="font-bold"
        >
          <span class="text-gray-400 break-all">
            <a
              target="_blank"
              v-for="(item, key) in infoSite.tx"
              :key="key"
              class="hover:text-[#409eff] underline cursor-pointer px-2"
              :href="item"
            >
              <el-icon class="align-middle"><Link /></el-icon> {{ key }}
            </a>
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style></style>
