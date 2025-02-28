<template>
  <div class="flex min-h-[100vh] h-[100vh] overflow-hidden items-start">
    <div class="min-w-[240px] h-[100vh] border-r border-[var(--border-color)]">
      <sidebar-block />
    </div>
    <div class="scroll-box overflow-y-auto flex-1 h-full min-h-[100vh] scroll-smooth">
      <div class="pt-10">
        <slot />
      </div>
      <menu-group />
      <el-backtop target=".scroll-box" />
    </div>
  </div>
</template>
