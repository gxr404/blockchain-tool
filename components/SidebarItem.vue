<script setup lang="ts">
import TokenSolana from '~icons/token/solana'
import TokenEthereum from '~icons/token/ethereum'
import TokenBitcoin from '~icons/token/bitcoin'

interface MenuItem {
  id: string
  title: string
  icon?: 'bitcoin' | 'ethereum' | 'solana'
  link?: string
  path?: string
  children?: MenuItem[]
}
interface Props {
  data: MenuItem
}

const iconMap = {
  bitcoin: TokenBitcoin,
  ethereum: TokenEthereum,
  solana: TokenSolana,
} as const

const props = withDefaults(defineProps<Props>(), {
  data() {
    return {
      title: '',
      id: '',
    }
  },
})
</script>
<template>
  <template v-if="props.data.link">
    <el-menu-item>
      <a class="text-gray-400" :href="props.data.link" target="_blank">
        {{ props.data.title }}
      </a>
      <!-- 源码库: https://github.com/iancoleman/bip39 -->
    </el-menu-item>
  </template>
  <template v-else-if="props.data.path">
    <el-menu-item :index="data.id" :route="{ path: props.data.path }">
      <template #title>
        <span v-if="props.data.icon && iconMap[props.data.icon]" class="text-sm mr-1">
          <component :is="iconMap[props.data.icon]" />
        </span>
        <span>{{ props.data.title }}</span>
      </template>
    </el-menu-item>
  </template>
  <template v-else-if="Array.isArray(props.data.children)">
    <el-sub-menu :index="props.data.id">
      <template #title>
        <span v-if="props.data.icon && iconMap[props.data.icon]" class="text-sm mr-1">
          <component :is="iconMap[props.data.icon]" />
        </span>
        <span>{{ props.data.title }}</span>
      </template>
      <sidebar-item v-for="item in props.data.children" :key="item.id" :data="item" />
    </el-sub-menu>
  </template>
  <!-- <el-sub-menu :index="data.id">
    <template #title>
      <span>{{ data.title }}</span>
    </template>

    <el-sub-menu index="elliptic-curve" vi>
      <template #title>
        <span>椭圆曲线</span>
      </template>
      <el-menu-item index="cryptology-ecc" :route="{ path: '/cryptology/ecc' }">
        <span>ECC基础</span>
      </el-menu-item>
    </el-sub-menu>
  </el-sub-menu> -->
</template>
