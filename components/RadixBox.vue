<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'

interface Props {
  defaultRadix: RadixPrefix
  numData: number | string
  convertBytesToRadix?: boolean
}
type TFnType = 'direct' | 'byte'

const props = withDefaults(defineProps<Props>(), {
  currentRadixPrefix: '0b',
  numData: NaN,
  byteTransformForRadix: false,
})

const radixPrefix = ref<RadixPrefix>(props.defaultRadix)
const fnType = ref<TFnType>('direct')
// const radixData = ref<string | number>(props.numData)

const radixData = computed(() => {
  if (fnType.value === 'byte') {
    return convertBytesToRadix(props.numData, radixPrefix.value)
  }
  return transformRadix(props.numData, props.defaultRadix, radixPrefix.value)
})

function updateRadix(radix: RadixPrefix) {
  radixPrefix.value = radix
}

const radixValue = computed(() => {
  return radixPrefixNumberMap[radixPrefix.value] || 16
})

const showByteTransform = computed(() => {
  if (props.convertBytesToRadix && props.defaultRadix !== '0x') {
    console.warn('[RadixBox]: 按字节转化功能需 传入的值为16进制数据')
  }
  return props.convertBytesToRadix && props.defaultRadix === '0x'
})

function copyHexData() {
  if (!radixData.value) return
  navigator.clipboard.writeText(radixData.value)
  ElMessage.success('copy success')
}

defineExpose({
  radixValue,
  updateRadix,
})
</script>

<template>
  <el-alert :closable="false" class="primary-alert radix-box relative !pr-6">
    <div class="flex break-all items-center">
      <div v-if="showByteTransform" class="border-r border-current pr-2 mr-2">
        <select v-model="fnType" class="outline-0 bg-transparent cursor-pointer">
          <option label="直接转化进制" value="direct">直接转化进制</option>
          <option label="按字节转化" value="byte"></option>
        </select>
      </div>
      <div>
        <select v-model="radixPrefix" class="outline-0 bg-transparent cursor-pointer">
          <option v-for="item in radixPrefixMap" :key="item" :label="item" :value="item"></option>
        </select>
      </div>
      <div class="border-l pl-2 ml-2 border-current radix-box-content">
        {{ radixData || '&nbsp;' }}
      </div>
    </div>
    <span class="copy-btn" @click="copyHexData" v-if="radixData">
      <copy-document class="inline-block w-[16px] h-[16px]"></copy-document>
    </span>
  </el-alert>
</template>
<style>
.radix-box:hover .copy-btn {
  display: block;
}
.radix-box .copy-btn {
  position: absolute;
  display: none;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
