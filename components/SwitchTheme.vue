<script setup lang="ts">
// import { isDark, toggleDark } from '../composables/dark'
import TablerMoonFilled from '~icons/tabler/moon-filled'
import TablerSunFilled from '~icons/tabler/sun-filled'

defineOptions({ inheritAttrs: false })

const colorMode = useColorMode()

const darkMode = ref(false)
const switchRef = ref()

function beforeChange() {
  return new Promise<boolean>((resolve) => {
    const isAppearanceTransition = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      resolve(true)
      return
    }

    const switchElement = switchRef.value
    const rect = switchElement.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const transition = document.startViewTransition(async () => {
      resolve(true)
      await nextTick()
    })
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: colorMode.value === 'dark' ? [...clipPath].reverse() : clipPath,
        },
        {
          // duration: 400,
          duration: 300,
          // duration: 1000,
          easing: 'ease-in',
          pseudoElement:
            colorMode.value === 'dark'
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
        }
      )
    })
  })
}
onMounted(() => {
  darkMode.value = colorMode.preference === 'dark'
})
async function onSwitchChange() {
  await beforeChange().catch((e) => console.log(e))
  darkMode.value = !darkMode.value
  colorMode.preference = darkMode.value ? 'dark' : 'light'
}
</script>

<template>
  <div class="theme-toggler-content">
    <!-- <el-switch
      ref="switchRef"
      v-model="darkMode"
      :before-change="beforeChange"
      :inactive-action-icon="TablerMoonFilled"
      :active-action-icon="TablerSunFilled"
      @change="onSwitchChange"
    /> -->
    <div @click="onSwitchChange" ref="switchRef">
      <TablerSunFilled v-if="darkMode"></TablerSunFilled>
      <TablerMoonFilled v-else></TablerMoonFilled>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__core) {
  // --el-switch-on-color: var(--color-warning);
  // --el-switch-off-color: var(--color-primary);
  // --el-switch-border-color: var(--border-color);

  .el-switch__action {
    width: 14px;
    height: 14px;
  }
}

:deep(.dark-icon) {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

:deep(.light-icon) {
  color: #606266;
}

:deep(.el-switch) {
  .el-icon {
    color: var(--color-primary);
  }
  &.is-checked {
    .el-icon {
      color: var(--color-warning);
    }
  }
}

.theme-toggler-content {
  // color: var(--text-color);
  transition: border-color var(--el-transition-duration),
    background-color var(--el-transition-duration-fast);
  background-color: transparent;
  border-radius: 50%;
  height: 24px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  // @include respond-to('md') {
  //   display: flex;
  //   align-items: center;
  // }
}
</style>
