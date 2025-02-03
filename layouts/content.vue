<template>
  <!-- <header class="h-20 flex items-center px-[20px] border-b">
    <h1 class="font-bold text-lg">Blockchain Tool</h1>
  </header> -->
  <div class="flex h-[100vh] overflow-hidden">
    <div class="min-w-[240px] bg-white h-[100vh] border-r">
      <sidebar-block />
    </div>
    <div class="overflow-y-auto flex-1 h-full">
      <slot />
    </div>
  </div>
</template>
