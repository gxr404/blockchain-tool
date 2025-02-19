<script setup lang="ts">
import BigNumber from 'bignumber.js'

interface Props {
  defaultRadix?: RadixPrefix
  disableSelect?: boolean
  formatter?: (value: string, radix: RadixPrefix) => string
}

const props = withDefaults(defineProps<Props>(), {
  defaultRadix: '0x',
  disableSelect: false,
})
const emit = defineEmits<{
  inputValue: [value: string]
  changeRadix: [newRadixPrefix: RadixPrefix, oldRadixPrefix: RadixPrefix]
}>()

const inputModel = defineModel<string>()
const hexModel = defineModel<string>('hex')
const decimalModel = defineModel<string>('decimal')
const inputValue = ref<string>(inputModel.value || '')
const radix = ref<RadixPrefix>(props.defaultRadix)

const hexRegex = /[^0-9a-fA-F]/g
const octalRegex = /[^0-7]/g
const binaryRegex = /[^0-1]/g
const decimalRegex = /[^0-9]/g

const radixMap = new Map([
  ['0x', hexRegex],
  ['0b', binaryRegex],
  ['0o', octalRegex],
  ['0d', decimalRegex],
])
let stopWatch = false

function onInput() {
  const regex = radixMap.get(radix.value) || decimalRegex
  inputValue.value = inputValue.value?.replace(regex, '')
  nextTick(() => {
    emit('inputValue', inputValue.value)
  })
}

const radixValue = computed(() => {
  return radixPrefixNumberMap[radix.value] || 16
})

function updateHexModel() {
  if (radix.value !== '0x' && isValidNumber(inputValue.value)) {
    const _radix = radixPrefixNumberMap[radix.value]
    const bigNum = BigNumber(inputValue.value, _radix)
    hexModel.value = bigNum.isNaN() ? '' : bigNum.toString(16)
    return
  }
  hexModel.value = inputValue.value
}

function updateDecimalModel() {
  if (radix.value !== '0d' && isValidNumber(inputValue.value)) {
    const _radix = radixPrefixNumberMap[radix.value]
    const bigNum = BigNumber(inputValue.value, _radix)
    decimalModel.value = bigNum.isNaN() ? '' : bigNum.toString(10)
    return
  }
  decimalModel.value = inputValue.value
}

watch(radix, (newRadixPrefix, oldRadixPrefix) => {
  const radix = radixPrefixNumberMap[newRadixPrefix]
  const oldRadix = radixPrefixNumberMap[oldRadixPrefix]
  if (inputValue.value && oldRadixPrefix) {
    const bigNum = BigNumber(inputValue.value, oldRadix)
    inputValue.value = bigNum.isNaN() ? '' : bigNum.toString(radix)
  }
  emit('changeRadix', newRadixPrefix, oldRadixPrefix)
})

watch(inputValue, (value, oldValue) => {
  if (value === oldValue) return
  stopWatch = true
  inputModel.value = inputValue.value
  updateDecimalModel()
  updateHexModel()
  stopWatch = false
})

watch(inputModel, (value, oldValue) => {
  if (value === oldValue || stopWatch) return // 避免不必要的触发
  inputValue.value = value || ''
})

watch(hexModel, (value, oldValue) => {
  if (value === oldValue || stopWatch) return // 避免不必要的触发
  if (radix.value !== '0x' && isValidNumber(value)) {
    const _radix = radixPrefixNumberMap[radix.value]
    const bigNum = BigNumber(value, 16)
    inputValue.value = bigNum.isNaN() ? '' : bigNum.toString(_radix)
    return
  }
  inputValue.value = value || ''
})

watch(decimalModel, (value, oldValue) => {
  if (value === oldValue || stopWatch) return // 避免不必要的触发
  if (radix.value !== '0d' && isValidNumber(value)) {
    const _radix = radixPrefixNumberMap[radix.value]
    const bigNum = BigNumber(value, 10)
    inputValue.value = bigNum.isNaN() ? '' : bigNum.toString(_radix)
    return
  }
  inputValue.value = value || ''
})

function clear() {
  nextTick(() => {
    emit('inputValue', '')
  })
}

defineExpose({
  radix,
  radixValue,
  updateRadix(_radix: RadixPrefix) {
    radix.value = _radix
  },
})

function _formatter(value: string) {
  if (typeof props.formatter === 'function') {
    return props.formatter(value, radix.value)
  }
  return value
}

function isValidNumber<T>(v: T | undefined): v is T {
  return v !== '' && typeof v !== 'undefined'
}
</script>
<template>
  <el-input
    v-model="inputValue"
    @input="onInput"
    clearable
    class="radix-input"
    @clear="clear"
    :formatter="_formatter"
  >
    <template #prepend>
      <template v-if="disableSelect">
        {{ radix }}
      </template>
      <template v-else>
        <el-select v-model="radix" style="width: 70px; height: 100%">
          <el-option label="0b" value="0b" />
          <el-option label="0o" value="0o" />
          <el-option label="0x" value="0x" />
          <el-option label="0d" value="0d" />
        </el-select>
      </template>
    </template>
  </el-input>
</template>

<style>
.radix-input.el-input.el-input-group--prepend
  .el-input-group__prepend
  .el-select
  .el-select__wrapper.is-focused {
  /* border: 1px solid #409eff !important; */
  /* background-color: red; */
  --el-input-border-color: #409eff;

  box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
    0 1px 0 0 var(--el-input-border-color) inset, 0 -1px 0 0 var(--el-input-border-color) inset,
    0 -1px 0 0 var(--el-input-border-color) inset, -1px 0 0 0 var(--el-input-border-color) inset;
}
.radix-input.el-input {
  --el-input-height: 38px;
}

.radix-input.el-input .el-select {
  min-height: var(--el-input-height);
}
.radix-input.el-input .el-select .el-select__wrapper {
  min-height: var(--el-input-height);
}

.radix-input.el-input .el-select__placeholder {
  text-align: center;
}
</style>
