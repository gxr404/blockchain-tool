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
        <el-menu-item index="hash256" :route="{ path: '/hash256' }">
          <span>hash256</span>
        </el-menu-item>

        <el-menu-item index="hash160" :route="{ path: '/hash160' }">
          <span>hash160</span>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="math">
        <template #title>
          <span>数学</span>
        </template>
        <el-menu-item index="math-base" :route="{ path: '/math/base' }">
          <span>基础</span>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="cryptology">
        <template #title>
          <span>密码学</span>
        </template>
        <el-sub-menu index="elliptic-curve">
          <template #title>
            <span>椭圆曲线</span>
          </template>
          <el-menu-item index="cryptology-ecc" :route="{ path: '/cryptology/ecc' }">
            <span>ECC</span>
          </el-menu-item>
          <el-menu-item index="cryptology-secp256k1" :route="{ path: '/cryptology/secp256k1' }">
            <span>Secp256k1</span>
          </el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
