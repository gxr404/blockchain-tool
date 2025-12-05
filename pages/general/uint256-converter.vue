<script setup lang="ts">
import { fromHex, toHex } from 'viem/utils'

const toOptions = [
  {
    value: 'string',
    label: 'string',
  },
  {
    value: 'number',
    label: 'number',
  },
  {
    value: 'boolean',
    label: 'boolean',
  },
] as const

const toOp = ref<'string' | 'number' | 'boolean'>(toOptions[0].value)
const uint256Input = ref('')

const output = ref('')

const utf8Reg = /[\uD800-\uDFFF]/g
// const hexReg = /[^0-9a-fA-F]/g
const numberReg = /[^0-9]/g

function outputInput() {
  if (toOp.value === 'string') {
    output.value = output.value.replace(utf8Reg, '')
  } else if (toOp.value === 'number') {
    output.value = output.value.replace(numberReg, '')
  }
  if (output.value) {
    let v: string | number = output.value
    if (toOp.value === 'number') {
      v = Number(output.value)
    }
    uint256Input.value = toHex(v).replace(/^0x/g, '')
  } else {
    uint256Input.value = ''
  }
}

function onUint256Input() {
  output.value = fromHex(`0x${uint256Input.value}`, toOp.value).toString()
}

function onSelectChange() {
  output.value = ''
  uint256Input.value = ''
}
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="uint256转换">
      <template #description>
        <p class="text-sm text-gray-400 mb-[10px]">
          uint256 是 Solidity（以太坊智能合约）中的一种基础类型
        </p>
        <p class="text-sm text-gray-400 mb-[40px]">
          uint256(Unsigned 256-bit Integer) 无符号 256 位整数
        </p>
      </template>
      <el-descriptions label-width="120" :column="1">
        <el-descriptions-item label="Uint256: ">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <radix-input v-model:hex="uint256Input" @input-value="onUint256Input" />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="To: ">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <el-select v-model="toOp" placeholder="Select" size="large" @change="onSelectChange">
              <el-option
                v-for="item in toOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="`${toOp}: `">
          <div class="inline-block w-[660px] min-h-[40px] align-middle">
            <el-input
              v-model="output"
              :disabled="toOp === 'boolean'"
              @input="outputInput"
              :rows="6"
              :show-word-limit="true"
              type="textarea"
            />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </content-card>
  </div>
</template>
