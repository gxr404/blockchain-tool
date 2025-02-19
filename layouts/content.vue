<template>
  <div class="flex min-h-[100vh] h-[100vh] overflow-hidden items-start">
    <div class="min-w-[240px] bg-white h-[100vh] border-r">
      <sidebar-block />
    </div>
    <div class="scroll-box overflow-y-auto flex-1 h-full min-h-[100vh] scroll-smooth">
      <slot />
      <el-backtop target=".scroll-box" />
    </div>
  </div>
</template>
