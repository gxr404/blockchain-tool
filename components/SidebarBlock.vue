<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div class="w-[200px]">
    <el-menu
      router
      class="el-menu-vertical-demo h-full"
      :default-active="route.name === 'index' ? 'hash256' : route.name?.toString()"
      :default-openeds="['hash']"
    >
      <el-sub-menu index="hash">
        <template #title>
          <span>哈希算法</span>
        </template>
        <el-menu-item index="hash256">
          <span>hash256</span>
        </el-menu-item>

        <el-menu-item index="hash160">
          <span>hash160</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

