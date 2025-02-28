<script lang="ts" setup>
import MdiGithub from '~icons/mdi/github'
import pkg from '~/package.json'

function goGithub() {
  if (!pkg.homepage) return
  // location.href = pkg.homepage
  window.open(pkg.homepage, '_blank')
}
</script>

<template>
  <div class="flex gap-1 absolute top-2 right-8">
    <!-- 12312
    hover:bg-accent hover:text-accent-foreground' -->
    <div
      class="h-8 w-8 px-0 cursor-pointer hover:bg-[var(--color-primary4)] hover:text-[var(--color-primary)] flex items-center justify-center rounded-md"
      @click="goGithub"
    >
      <mdi-github />
    </div>
    <div
      class="h-8 w-8 px-0 cursor-pointer hover:bg-[var(--color-primary4)] hover:text-[var(--color-primary)] flex items-center justify-center rounded-md"
    >
      <switch-theme />
    </div>
  </div>
</template>
