<script setup lang="ts">
import BigNumber from 'bignumber.js'

interface Props {
  defaultRadix?: RadixPrefix
}

const props = withDefaults(defineProps<Props>(), {
  defaultRadix: '0x',
})
const emit = defineEmits(['changeRadix', 'inputValue'])

const inputModel = defineModel<string>()
const inputValue = ref<string>(inputModel.value || '')
const radix = ref<RadixPrefix>(props.defaultRadix)

const hexRegex = /[^0-9a-fA-F]/g
const octalRegex = /[^0-7]/g
const binaryRegex = /[^0-1]/g
const decimalRegex = /[^0-9]/g

const radixPrefixMap = {
  '0d': 10,
  '0x': 16,
  '0b': 2,
  '0o': 8,
}

const radixMap = new Map([
  ['0x', hexRegex],
  ['0b', binaryRegex],
  ['0o', octalRegex],
  ['0d', decimalRegex],
])

watch(radix, (newRadixPrefix, oldRadixPrefix) => {
  const radix = radixPrefixMap[newRadixPrefix]
  const oldRadix = radixPrefixMap[oldRadixPrefix]
  if (inputValue.value && oldRadixPrefix) {
    inputValue.value = BigNumber(inputValue.value, oldRadix).toString(radix)
    inputModel.value = inputValue.value
  }
  emit('changeRadix', newRadixPrefix, oldRadixPrefix)
})

watch(inputModel, (value) => {
  inputValue.value = value || ''
})

function onInput() {
  const regex = radixMap.get(radix.value) || decimalRegex
  inputValue.value = inputValue.value?.replace(regex, '')
  inputModel.value = inputValue.value
  emit('inputValue')
}

const radixValue = computed(() => {
  return radixPrefixMap[radix.value] || 16
})

defineExpose({
  radix,
  radixValue,
  updateRadix(_radix: RadixPrefix) {
    radix.value = _radix
  },
})
</script>
<template>
  <el-input v-model="inputValue" @input="onInput" clearable>
    <template #prepend>
      <el-select v-model="radix" style="width: 70px">
        <el-option label="0b" value="0b" />
        <el-option label="0o" value="0o" />
        <el-option label="0x" value="0x" />
        <el-option label="0d" value="0d" />
      </el-select>
    </template>
  </el-input>
</template>
