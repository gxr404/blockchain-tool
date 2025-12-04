<script setup lang="ts">
import { erc1155Abi, erc20Abi, erc721Abi, type AbiParameter } from 'viem'
import { decodeFunctionData, parseAbiItem, type ParseAbiItem } from 'viem/utils'
import { CopyDocument } from '@element-plus/icons-vue'
import type { RadixInput } from '#components'

const selectorOptions = [
  {
    value: 'ERC-20',
    label: 'ERC-20',
  },
  {
    value: 'ERC-1155',
    label: 'ERC-1155',
  },
  {
    value: 'ERC-721',
    label: 'ERC-721',
  },
  {
    value: 'custom',
    label: '自定义',
  },
]

const abiMap = {
  'ERC-20': erc20Abi,
  'ERC-1155': erc1155Abi,
  'ERC-721': erc721Abi,
}

const abi = ref(selectorOptions[0].value)
const customAbiInput = ref('')
const showCustomAbiInput = computed(() => {
  const show = abi.value === 'custom'
  if (!show) customAbiInput.value = ''
  return show
})
const inputData = ref('')
const customeAbi = computed(() => {
  if (!showCustomAbiInput.value) return
  let abi: Readonly<AbiParameter[]> | ParseAbiItem<string>[] = []
  // 输入的已经是json abi 则直接返回
  try {
    abi = JSON.parse(customAbiInput.value)
    return abi
  } catch (e) {
    console.warn(e)
  }
  try {
    abi = [parseAbiItem(customAbiInput.value)]
    return abi
  } catch (e) {
    console.warn(e)
  }
  return abi
})

const output = computed(() => {
  let _abi: Readonly<AbiParameter[]> | ParseAbiItem<string>[] | null = null
  if (abi.value === 'custom' && customeAbi.value) {
    _abi = customeAbi.value
  } else {
    const abiMapKey = abi.value as keyof typeof abiMap
    _abi = abiMap[abiMapKey]
  }
  if (!_abi || (Array.isArray(_abi) && _abi.length == 0)) return
  if (!inputData.value) return

  try {
    const outputRes = decodeFunctionData({
      abi: _abi,
      data: `0x${inputData.value}`,
    })
    return JSON.stringify(outputRes, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 4)
  } catch (e) {
    console.warn(e)
    return ''
  }
})

function copy(data: string) {
  navigator.clipboard.writeText(data)
  ElMessage.success('copy success')
}
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="EVM call data解析">
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Abi: ">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <el-select v-model="abi" placeholder="Select" size="large">
              <el-option
                v-for="item in selectorOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Custom Abi: " v-show="showCustomAbiInput">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <el-input
              v-model="customAbiInput"
              :rows="6"
              :show-word-limit="true"
              placeholder="Please input custom Abi"
              type="textarea"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="data: ">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <radix-input v-model:hex="inputData" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="output: ">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <div class="primary-box min-h-[41px] flex-1 whitespace-pre">
              {{ output }}
              <span class="copy-btn bottom-4" @click="copy(output)" v-if="output">
                <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
              </span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </content-card>
  </div>
</template>
