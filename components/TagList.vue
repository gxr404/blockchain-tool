<script setup lang="ts">
import MdiEthereum from '~icons/mdi/ethereum'
import Bitcoin from '~icons/mdi/bitcoin'

// import LogosEthereum from '~icons/logos/ethereum'

interface Props {
  list: string[]
}

const props = defineProps<Props>()

const allTagList = [
  {
    text: 'bitcoin',
    icon: Bitcoin,
  },
  {
    text: 'ethereum',
    icon: MdiEthereum,
  },
]

const tagList = computed(() => {
  return props.list
    .map((name) => allTagList.find((item) => item.text === name))
    .filter((item) => item !== undefined)
})
</script>

<template>
  <div class="pl-2 inline-flex">
    <span class="pl-2 inline-flex">
      <el-tag
        type="primary"
        size="small"
        round
        v-for="(item, index) in tagList"
        :key="`tag-${index}`"
      >
        <span><component :is="item.icon" class="inline-block mr-[2px]" />{{ item.text }}</span>
      </el-tag>
    </span>
  </div>
</template>
