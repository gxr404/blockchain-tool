<script setup lang="ts">
// import MdiEthereum from '~icons/mdi/ethereum'
// import Bitcoin from '~icons/mdi/bitcoin'
import TokenSolana from '~icons/token/solana'
import TokenEthereum from '~icons/token/ethereum'
import TokenBitcoin from '~icons/token/bitcoin'

// import LogosEthereum from '~icons/logos/ethereum'

interface Props {
  list: string[]
}

const props = defineProps<Props>()

const allTagList = [
  {
    text: 'bitcoin',
    icon: TokenBitcoin,
  },
  {
    text: 'ethereum',
    icon: TokenEthereum,
  },
  {
    text: 'solana',
    icon: TokenSolana,
  },
]

const tagList = computed(() => {
  return props.list
    .map((name) => allTagList.find((item) => item.text === name))
    .filter((item) => item !== undefined)
})
</script>

<template>
  <span class="pl-2 inline-flex">
    <span class="pl-2 inline-flex gap-2">
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
  </span>
</template>
