<script lang="ts" setup>
import pkg from '~/package.json'
const route = useRoute()
</script>
<template>
  <div class="min-w-[280px] h-[100vh] bg-[var(--bg)]">
    <header id="header" class="h-[160px] relative z-10">
      <!-- -mt-[94px] -->
      <div id="hd-bg" class="absolute w-full"></div>
      <nuxt-link to="/" class="h-[100px] flex items-center justify-center">
        <div class="w-[40px] h-[40px] relative z-10 mr-2">
          <img src="/logo.png" class="inline-block" />
        </div>
        <h1 class="font-bold text-[24px] text-white relative z-10">Blockchain Tool</h1>
      </nuxt-link>
    </header>
    <div class="h-[100vh] pt-[160px] -mt-[160px]">
      <div
        class="h-full pt-[40px] pl-[10px] -mt-[40px] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-[#e4e4e7] dark:scrollbar-thumb-[#6b6b6b] scrollbar-track-withe hover:scrollbar-thumb-secondary-foreground"
        style="height: calc(100% + 40px)"
      >
        <el-menu router class="!mb-10" :default-active="route.name?.toString()">
          <sidebar-item v-for="item in routeList" :key="item.id" :data="item" />
        </el-menu>
      </div>
    </div>
    <footer
      class="sticky bottom-0 backdrop-blur-sm -mt-[40px] h-[40px] flex items-center justify-center border-t border-[var(--border-color)] text-gray-400 dark:bg-[var(--bg2)]"
    >
      v{{ pkg.version }}
    </footer>
  </div>
</template>

<style>
#hd-bg {
  background-image: url(/header-bg.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 100%;
  height: 100%;
}
</style>
