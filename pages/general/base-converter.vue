<script setup lang="ts">
import BigNumber from 'bignumber.js'

const binary = ref('')
const decimal = ref('')
const octal = ref('')
const hex = ref('')
const hexRegex = /[^0-9a-fA-F]/g
const octalRegex = /[^0-7]/g
const binaryRegex = /[^0-1]/g

function onDecimalInput() {
  const tempValue = parseInt(decimal.value, 10)
  decimal.value = !isNaN(Number(tempValue)) ? String(tempValue) : ''
  if (!decimal.value) {
    reset()
    return
  }
  const instance = BigNumber(decimal.value, 10)
  binary.value = instance.toString(2)
  octal.value = instance.toString(8)
  hex.value = instance.toString(16)
}

function onHexInput() {
  hex.value = hex.value.replace(hexRegex, '')
  if (!hex.value) {
    reset()
    return
  }
  const instance = BigNumber(hex.value, 16)
  binary.value = instance.toString(2)
  octal.value = instance.toString(8)
  decimal.value = instance.toString(10)
}

function onBinaryInput() {
  binary.value = binary.value.replace(binaryRegex, '')
  if (!binary.value) {
    reset()
    return
  }
  const instance = BigNumber(binary.value, 2)
  octal.value = instance.toString(8)
  decimal.value = instance.toString(10)
  hex.value = instance.toString(16)
}

function onOctalInput() {
  octal.value = octal.value.replace(octalRegex, '')
  if (!octal.value) {
    reset()
    return
  }
  const instance = BigNumber(octal.value, 8)
  binary.value = instance.toString(2)
  decimal.value = instance.toString(10)
  hex.value = instance.toString(16)
}

function reset() {
  binary.value = ''
  octal.value = ''
  decimal.value = ''
  hex.value = ''
}
</script>

<template>
  <div class="p-10">
    <el-descriptions label-width="80" :column="1">
      <template #title>
        <p class="font-bold text-lg mb-[20px]">进制转化</p>
      </template>
      <el-descriptions-item label="十进制">
        <div class="inline-block min-w-[680px]">
          <el-input v-model="decimal" clearable @input="onDecimalInput">
            <template #prepend>0d</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="二进制">
        <div class="inline-block min-w-[680px]">
          <el-input v-model="binary" clearable @input="onBinaryInput">
            <template #prepend>0b</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="八进制">
        <div class="inline-block min-w-[680px]">
          <el-input v-model="octal" clearable @input="onOctalInput">
            <template #prepend>0o</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="十六进制">
        <div class="inline-block min-w-[680px]">
          <el-input v-model="hex" clearable @input="onHexInput">
            <template #prepend>0x</template>
          </el-input>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
