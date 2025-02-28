<script setup lang="ts">
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
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  data() {
    return {
      title: '',
      id: '',
    }
  },
  level: 0,
})
</script>
<template>
  <template v-if="props.level === 0">
    <div class="bg-[var(--home-menu-bg)] p-4 rounded flex flex-col min-w-[240px]">
      <h1 class="font-bold text-[var(--home-menu-c)] text-[20px] pb-2">{{ props.data.title }}</h1>
      <!-- <nuxt-link to="/hash/hash160">123</nuxt-link> -->
      <template v-if="Array.isArray(props.data.children)">
        <div>
          <home-menu-item
            :data="subItem"
            v-for="subItem in props.data.children"
            :key="subItem.id"
            :level="props.level + 1"
          />
        </div>
      </template>
    </div>
  </template>
  <template v-else-if="props.data.link">
    <!-- <el-menu-item> -->
    <span :style="{ paddingLeft: `${props.level * 10}px` }" class="py-1">
      <a
        class="text-gray-400 underline hover:text-[var(--color-primary)] mt-1"
        :href="props.data.link"
        target="_blank"
      >
        {{ props.data.title }}
      </a>
      <!-- class="hover:text-[var(--color-primary)] underline cursor-pointer px-2" -->
    </span>
    <!-- 源码库: https://github.com/iancoleman/bip39 -->
    <!-- </el-menu-item> -->
  </template>
  <template v-else-if="props.data.path">
    <!-- <el-menu-item :index="data.id" :route="{ path: props.data.path }"> -->
    <!-- <template #title> -->
    <div
      class="hover:bg-[var(--color-primary4)] hover:text-[var(--color-primary)] dark:hover:text-[#fff] p-1 rounded mt-1"
      :style="{ paddingLeft: `${props.level * 10}px` }"
    >
      <nuxt-link :to="props.data.path">
        <span class="flex items-center">
          <span>{{ props.data.title }}</span>
        </span>
      </nuxt-link>
    </div>
    <!-- </template> -->
    <!-- </el-menu-item> -->
  </template>
  <template v-else-if="Array.isArray(props.data.children)">
    <div class="flex items-center my-1">
      <span
        class="text-[var(--home-menu-c)] font-semibold"
        :style="{ paddingLeft: `${props.level * 10}px` }"
        >{{ props.data.title }}</span
      >
    </div>
    <div>
      <home-menu-item
        :data="item"
        v-for="item in props.data.children"
        :key="item.id"
        :level="props.level + 1"
      />
    </div>
  </template>
</template>
