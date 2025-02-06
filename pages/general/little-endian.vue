<script setup lang="ts">
import BigNumber from 'bignumber.js'

const decimal = ref('')
const hexBigEndian = ref('')
const hexLittleEndian = ref('')
const isHexBigEndianError = ref(false)
const isHexLittleEndianError = ref(false)
const filedSize = ref('any')
const hexRegex = /[^0-9a-fA-F]/g
const hexLittleEndianEl = ref()

const filedSizeMap = [
  { label: 'Any', value: 'any' },
  { label: '2 Byte', value: '2' },
  { label: '4 Bytes', value: '4' },
  { label: '8 Bytes', value: '8' },
  { label: '12 Bytes', value: '12' },
  { label: '16 Bytes', value: '16' },
  { label: '32 Bytes', value: '32' },
]

function onDecimalInput() {
  const instance = BigNumber(decimal.value, 10)
  decimal.value = instance.isNaN() ? '' : instance.toString(10)
  if (!decimal.value) {
    hexBigEndian.value = ''
    hexLittleEndian.value = ''
    cleanError()
    return
  }

  hexBigEndian.value = instance.toString(16)
  const len = hexBigEndian.value.length
  const size = len % 2 === 0 ? len : len + 1
  hexBigEndian.value = hexBigEndian.value.padStart(size, '0')
  const fileSizeLen = Number(filedSize.value) * 2
  if (filedSize.value !== filedSizeMap[0].value && hexBigEndian.value.length < fileSizeLen) {
    hexBigEndian.value = hexBigEndian.value.padStart(fileSizeLen, '0')
  }
  hexLittleEndian.value = hexBigEndian.value.match(/../g)?.reverse().join('') || ''
  cleanError()
}

function onHexBigEndianInput() {
  cleanError()
  hexBigEndian.value = hexBigEndian.value.replace(hexRegex, '')
  isHexBigEndianError.value = hexBigEndian.value.length % 2 !== 0

  if (isHexBigEndianError.value || !hexBigEndian.value) {
    decimal.value = ''
    hexLittleEndian.value = ''
    return
  }
  hexLittleEndian.value = hexBigEndian.value.match(/../g)?.reverse().join('') || ''
  decimal.value = BigNumber(hexBigEndian.value, 16).toString(10)
  filedSize.value = filedSizeMap[0].value
}

function onHexLittleEndianInput() {
  cleanError()
  hexLittleEndian.value = hexLittleEndian.value.replace(hexRegex, '')
  isHexLittleEndianError.value = hexLittleEndian.value.length % 2 !== 0
  nextTick(() => {
    hexLittleEndianEl.value?.focus()
  })
  if (isHexLittleEndianError.value || !hexLittleEndian.value) {
    decimal.value = ''
    hexBigEndian.value = ''
    return
  }
  hexBigEndian.value = hexLittleEndian.value.match(/../g)?.reverse().join('') || ''
  decimal.value = BigNumber(hexBigEndian.value, 16).toString(10)
  filedSize.value = filedSizeMap[0].value
}

watch(filedSize, () => {
  if (!hexBigEndian.value) {
    filedSize.value = filedSizeMap[0].value
    return
  }
  if (!decimal.value) {
    decimal.value = BigNumber(hexBigEndian.value, 16).toString(10)
  }
  onDecimalInput()
  return
})

function cleanError() {
  isHexBigEndianError.value = false
  isHexLittleEndianError.value = false
}
</script>

<template>
  <div class="p-10">
    <el-descriptions label-width="200" :column="1">
      <template #title>
        <p class="font-bold text-lg mb-[20px]">小端字节序</p>
        <p class="text-sm text-gray-400 mb-[20px]">
          小端字节序(Little-Endian)指的是多字节数据在内存中存储时，
          <b>低字节存储在低地址，高字节存储在高地址</b>
        </p>
      </template>
      <el-descriptions-item label="十进制">
        <div class="inline-block min-w-[680px]">
          <el-input v-model="decimal" clearable @input="onDecimalInput">
            <template #prepend>0d</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="十六进制字节(大端字节)">
        <div class="inline-block min-w-[680px]">
          <el-input
            :class="isHexBigEndianError ? 'error' : ''"
            v-model="hexBigEndian"
            clearable
            @input="onHexBigEndianInput"
          >
            <template #prepend>0x</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label=" " v-if="hexBigEndian && !isHexBigEndianError">
        <div class="inline-flex flex-wrap w-[680px] gap-2">
          <span
            class="flex items-center justify-center border rounded min-w-[30px] min-h-[30px] text-[#409eff] bg-[#ecf5ff] border-[#a0cfff]"
            v-for="(item, index) in hexBigEndian.match(/../g)"
            :key="`${item}-${index}`"
          >
            {{ item }}
          </span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="十六进制字节(小端字节)">
        <div class="inline-block min-w-[680px]">
          <el-input
            ref="hexLittleEndianEl"
            v-model="hexLittleEndian"
            :class="isHexLittleEndianError ? 'error' : ''"
            clearable
            @input="onHexLittleEndianInput"
          >
            <template #prepend>0x</template>
          </el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label=" " v-if="hexLittleEndian && !isHexLittleEndianError">
        <div class="inline-flex flex-wrap w-[680px] gap-2">
          <span
            class="flex items-center justify-center border rounded min-w-[30px] min-h-[30px] text-[#409eff] bg-[#ecf5ff] border-[#a0cfff]"
            v-for="(item, index) in hexLittleEndian.match(/../g)"
            :key="`${item}-${index}`"
          >
            {{ item }}
          </span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <el-alert v-if="isHexLittleEndianError || isHexBigEndianError" type="error" :closable="false">
      <!-- Error: Expecting a complete string of bytes. A whole byte is two hexadecimal digits. -->
      错误, 一个完整的字节是两个16进制数字
    </el-alert>
    <div class="mt-2">
      <span class="pr-2 align-text-bottom">字段大小: </span>
      <el-radio-group v-model="filedSize">
        <el-radio v-for="item in filedSizeMap" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<style scoped>
:deep(.error) {
  /* --el-input-text-color:  */
  --el-input-bg-color: #f56c6c;
  --el-input-text-color: #fff;
  --el-input-focus-border: red;
  --el-input-border-color: red;
  --el-fill-color-light: #f56c6c;
  --el-color-info: #fff;
  --el-input-hover-border-color: red;
  --el-input-focus-border-color: red;
  --el-input-icon-color: #fff;
  --el-input-clear-hover-color: #fff;
}
</style>
