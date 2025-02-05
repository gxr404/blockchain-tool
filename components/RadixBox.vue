<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  radixPrefix: RadixPrefix
  numData: number | string
}

const props = withDefaults(defineProps<Props>(), {
  currentRadixPrefix: '0b',
  numData: NaN,
})

const radixPrefix = ref<RadixPrefix>(props.radixPrefix)
// const radixData = ref<string | number>(props.numData)

const radixData = computed(() => {
  return transformRadix(props.numData, props.radixPrefix, radixPrefix.value)
})
</script>

<template>
  <div class="flex break-all items-center">
    <div>
      <!-- italic -->
      <select v-model="radixPrefix" class="outline-0 bg-transparent">
        <option v-for="item in radixPrefixMap" :key="item" :label="item" :value="item"></option>
      </select>
    </div>
    <div class="border-l pl-2 ml-2 border-current">{{ radixData || '&nbsp;' }}</div>
  </div>
</template>
