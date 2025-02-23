<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import { compactSizeToHex } from '~/utils/compactSize'
import type { RadixInput } from '#components'

type RadixInputType = InstanceType<typeof RadixInput>

const inputData = ref('')
const inputRef = ref<RadixInputType>()
const compactSizeValue = ref('')
const hexRegex = /[^0-9a-fA-F]/g
const isInputDataError = ref(false)
const isCompactSizeInputError = ref(false)
const errorMsg = ref('')
const compactSizePrefix = ref()

const compactSizePrefixMap = [
  {
    value: '',
    description: '当前字节(0 - 252) —— 无前缀',
    label: '<=FC',
    maxDecimal: '252',
    maxHex: 'fc',
    maxCompactSize: 'fc',
  },
  {
    value: 'fd',
    description: '接下来的2字节 (253 ~ 65535) —— 小端序',
    label: 'FD',
    maxDecimal: '65535',
    maxHex: 'ffff',
    maxCompactSize: 'fdffff',
  },
  {
    value: 'fe',
    description: '接下来的4字节 (65536 ~ 4294967295) —— 小端序',
    label: 'FE',
    maxDecimal: '4294967295',
    maxHex: 'ffffffff',
    maxCompactSize: 'feffffffff',
  },
  {
    value: 'ff',
    description: '接下来的8字节 (4294967296 ~ 18446744073709551615) —— 小端序',
    label: 'FF',
    maxDecimal: '18446744073709551615',
    maxHex: 'ffffffffffffffff',
    maxCompactSize: 'ffffffffffffffffff',
  },
]

function onInputData() {
  isInputDataError.value = false
  if (!inputRef.value) return

  let hex = inputData.value
  if (inputRef.value.radixValue !== 16) {
    hex = BigNumber(inputData.value, inputRef.value.radixValue).toString(16)
  }
  if (!inputData.value) {
    compactSizeValue.value = ''
    return
  }

  updateCompactSizeValue(hex)
}

function onRadixPrefixChange() {
  if (!inputData.value) return
  if (!inputRef.value) return

  let hex = inputData.value
  if (inputRef.value.radixValue !== 16) {
    hex = BigNumber(inputData.value, inputRef.value.radixValue).toString(16)
  }

  updateCompactSizeValue(hex)
}

function updateCompactSizeValue(hex: string) {
  if (hex) {
    try {
      const { data, prefix } = hexToCompactSize(hex)
      const findPrefix = compactSizePrefixMap.find((item) => item.value === prefix)
      if (findPrefix) {
        compactSizeValue.value = `${prefix}${data}`
        compactSizePrefix.value = findPrefix.value
        isInputDataError.value = false
        isCompactSizeInputError.value = false
      }
    } catch (e) {
      isInputDataError.value = true
      errorMsg.value = (e as Error).message || 'unknown'
      compactSizeValue.value = ''
      compactSizePrefix.value = undefined
    }
  } else {
    compactSizeValue.value = ''
  }
}

function onInputCompactSizeValue() {
  compactSizeValue.value = compactSizeValue.value.replace(hexRegex, '')
  isCompactSizeInputError.value = false
  if (!compactSizeValue.value) return
  if (!inputRef.value) return
  try {
    const { prefix, hex } = compactSizeToHex(compactSizeValue.value)
    const findPrefix = compactSizePrefixMap.find((item) => item.value === prefix)
    if (findPrefix) {
      compactSizePrefix.value = findPrefix.value
      const radix = inputRef.value.radixValue
      inputData.value = radix !== 16 ? BigNumber(hex, 16).toString(radix) : hex
    }
  } catch (e) {
    inputData.value = ''
    compactSizePrefix.value = undefined
    isCompactSizeInputError.value = true
    errorMsg.value = (e as Error).message || 'unknown'
  }
}

function onCompactSizePrefixChange() {
  if (!inputRef.value) return
  const radix = inputRef.value.radixValue

  const findCompactSizePrefix = compactSizePrefixMap.find(
    (item) => item.value === compactSizePrefix.value
  )
  if (findCompactSizePrefix) {
    inputData.value =
      radix !== 16
        ? BigNumber(findCompactSizePrefix.maxHex, 16).toString(radix)
        : findCompactSizePrefix.maxHex
    compactSizeValue.value = findCompactSizePrefix.maxCompactSize
    isCompactSizeInputError.value = false
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Compact Size">
      <template #description>
        <p class="text-sm text-gray-400 mb-[10px]">
          compact size是比特币(Bitcoin)协议中用于表示变长整数的一种编码格式。
        </p>
        <p class="text-sm text-gray-400 mb-[10px]">
          它<b>用于减少数据大小</b>，特别是在存储或传输交易时，能节省存储空间。
        </p>

        <p class="text-sm text-gray-400 mb-[10px]">
          交易原始数据(raw transaction)和区块原始数据(raw block)中的很多字段，都使用这个格式编码
        </p>
        <p class="text-sm text-gray-400 mb-[10px]">
          对于较小的数字(小于252)存储只需一个字节，且无前缀。
        </p>

        <p class="text-sm text-gray-400 mb-[40px]">
          对于较大的数字，使用前缀 + 数据部分(接下来的2、4或8字节),<b
            >需注意, 数据部分是小端字节序</b
          >
        </p>
      </template>
      <div>
        <el-descriptions label-width="130" :column="1">
          <el-descriptions-item label="整数">
            <div class="inline-block min-w-[660px]">
              <radix-input
                v-model="inputData"
                :class="isInputDataError ? 'error' : ''"
                default-radix="0d"
                @change-radix="onRadixPrefixChange"
                @input-value="onInputData"
                ref="inputRef"
              >
              </radix-input>
            </div>
            <div class="mt-[12px] pr-[12px]" v-if="isInputDataError">
              <el-alert type="error" :closable="false">
                {{ errorMsg }}
              </el-alert>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Compact Size">
            <div class="inline-block min-w-[660px]">
              <el-input
                :class="isCompactSizeInputError ? 'error' : ''"
                v-model="compactSizeValue"
                clearable
                @input="onInputCompactSizeValue"
              >
              </el-input>
            </div>
            <div class="mt-[12px] pr-[12px]" v-if="isCompactSizeInputError">
              <el-alert type="error" :closable="false">
                {{ errorMsg }}
              </el-alert>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="前缀">
            <div class="inline-block min-w-[660px]">
              <el-radio-group
                v-model="compactSizePrefix"
                class="w-[660px]"
                @change="onCompactSizePrefixChange"
              >
                <el-radio
                  v-for="item in compactSizePrefixMap"
                  :key="item.value"
                  :value="item.value"
                  class="w-[600px]"
                >
                  {{ item.label }}
                  <span class="text-[12px] text-gray-400">—— {{ item.description }}</span>
                </el-radio>
              </el-radio-group>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- <div class="mt-2">
        <h2>前缀</h2>
        <el-radio-group v-model="compactSizePrefix">
          <el-radio
            v-for="item in compactSizePrefixMap"
            :key="item.value"
            :value="item.value"
            class="w-full"
          >
            {{ item.label }} <span>{{ item.description }}</span>
          </el-radio>
        </el-radio-group>
      </div> -->
      </div>
      <el-collapse class="mt-20">
        <!-- <el-collapse-item title="规则" name="1"> </el-collapse-item> -->
        <el-collapse-item title="🤔 为什么节省空间呢？" name="2">
          <p>
            例如: 源数据是 "70015", Compact Size编码后"0xFE 7F 11 01 00" 而直接转成16进制存储"1117F"
            不是更节省空间吗?
          </p>
          <div
            class="text-[#409eff] bg-[#ecf5ff] border-[#a0cfff] leading-6 text-sm rounded-md p-4 my-4"
          >
            <p>
              猜想: 对于区块链解析区块结构时, 拿到手的源数据如何区分字段,
              是不是只能固定字段长度才能区分字段?
            </p>
            <p>例如: 源数据是 `1a1117F` 其中a字段的数据是'1A', b字段是'1117F'。</p>
            <p class="mt-2">
              此时为了区分a字段b字段 只能事先约定好a字段b字段各种都占4个字节,
              那此时源数据就需变成`0000001A0001117F`, 按4个字节去分割数据 区分 a字段
              `0000001A`和b字段`0001117F`
            </p>

            <p class="mt-2">可以看出对于小数据很多'0'占位符, 如果字段最大值支持32个字节呢?</p>
            <p class="mt-2">
              如果改用Compact Size 源数据是 `1A FE 7F 11 01 00` 按compact size的规则, 从头解析 1A
              非'FD'/'FE'/'FF' 则认为是一个小于255的字段 则a字段是'1A' 接着解析到 FE
              代表该字段是在(65536 - 4294967295)这个范围内，即取后面4个字节即可 则 b字段的值是 '7F
              11 01 00' (小端序) ———> 即 '00 01 11 7F' ———> '1117F' , 其中a字段的数据是'1a',
              b字段是'1117F'。
            </p>
            <p class="mt-2">
              结论: 直接使用源数据'0000001A0001117F'和 compact size的源数据 '1AFE7F110100'
              肯定是Compact Size跟节省空间，而且支持的数据范围更广
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </content-card>
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
.el-radio.is-checked span {
  color: inherit;
}
</style>
