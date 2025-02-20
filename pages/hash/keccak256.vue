<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

import 'element-plus/es/components/message/style/css'

const hexData = ref('')
const inputType = ref<InputType>('hex')

const hashResult = computed(() => {
  // Uint8Array<ArrayBufferLike>
  if (!hexData.value) return ''
  // const res = keccak_256(hexData.value)
  const res = keccak256(hexData.value, inputType.value)
  return Array.from(res)
    .map((i) => i.toString(16).padStart(2, '0'))
    .join('')
})

function copyHashResult() {
  if (!hashResult.value) return
  navigator.clipboard.writeText(hashResult.value)
  ElMessage.success('copy success')
}
</script>
<template>
  <div class="p-10">
    <div class="flex flex-col p-6 border rounded bg-white mt-10 w-[960px]">
      <h1 class="text-[26px] font-bold">
        Keccak256
        <tag-list :list="['ethereum']" />
      </h1>
      <p class="text-sm text-gray-400 mt-4">在Ethereum中用于生成地址时使用</p>

      <div class="mt-8">
        <el-descriptions label-width="100" :column="1">
          <el-descriptions-item label="输入数据类型: ">
            <div class="inline-block w-[660px] min-h-[40px] align-middle">
              <el-select v-model="inputType" placeholder="Select" size="large">
                <el-option label="Hex" value="hex" />
                <el-option label="Utf-8" value="utf8" />
              </el-select>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Input: ">
            <div class="inline-block w-[660px] min-h-[40px] align-middle">
              <el-input
                style="width: 100%"
                v-model="hexData"
                :rows="6"
                :show-word-limit="true"
                placeholder="Please input"
                type="textarea"
              />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Output(Hex): ">
            <div class="inline-block w-[660px] primary-box min-h-[40px] align-middle">
              {{ hashResult }}
              <span class="copy-btn" @click="copyHashResult" v-if="hashResult">
                <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
              </span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
