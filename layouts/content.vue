<template>
  <header class="h-24 flex items-center px-[20px] border-b">
    <h1 class="font-bold text-lg">Blockchain Tool</h1>
  </header>
  <div class="flex h-full min-h-[100vh] pt-24 -mt-24">
    <sidebar-block />
    <slot />
  </div>
</template>
