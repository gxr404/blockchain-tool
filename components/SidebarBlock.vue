<script lang="ts" setup>
const route = useRoute()
</script>
<template>
  <div class="min-w-[240px] bg-white h-[100vh]">
    <header id="header" class="h-[160px] relative z-10">
      <!-- -mt-[94px] -->
      <div id="hd-bg" class="absolute w-full"></div>
      <div class="h-[100px] flex items-center justify-center">
        <h1 class="font-bold text-lg text-white relative z-10">Blockchain Tool</h1>
      </div>
    </header>
    <div class="h-[100vh] pt-[120px] -mt-[120px]">
      <div
        class="h-full pt-[40px] pl-[10px] -mt-[40px] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-withe hover:scrollbar-thumb-secondary-foreground"
      >
        <el-menu
          router
          class="el-menu-vertical-demo"
          :default-active="route.name === 'index' ? 'hash256' : route.name?.toString()"
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

          <el-sub-menu index="general">
            <template #title>
              <span>通用</span>
            </template>
            <el-menu-item
              index="general-base-converter"
              :route="{ path: '/general/base-converter' }"
            >
              <span>进制转换</span>
            </el-menu-item>
            <el-menu-item index="general-little-endian" :route="{ path: '/general/little-endian' }">
              <span>小端字节序</span>
            </el-menu-item>
            <el-menu-item index="general-compact-size" :route="{ path: '/general/compact-size' }">
              <span>Compact Size</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
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
.el-menu {
  /* border-right: 0; */
  --el-menu-item-height: 40px;
  --el-menu-sub-item-height: 40px;
  .el-sub-menu__title {
    border-radius: 6px;
  }
}
</style>
