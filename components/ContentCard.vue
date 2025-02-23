<script setup lang="ts">
interface Props {
  title?: string
  titleLarge?: boolean
  subTitle?: string
  description?: string
  tagData?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subTitle: '',
  description: '',
  tagData: () => [],
})
</script>

<template>
  <div class="flex flex-col p-10 border rounded bg-white w-[980px]">
    <h1 class="text-lg font-bold mb-4" v-if="title">
      <span :class="['font-bold', titleLarge ? 'text-[26px]' : '']">{{ props.title }}</span>
      <span class="text-sm text-gray-400 ml-2">{{ props.subTitle }}</span>
      <span v-if="props.tagData.length > 0">
        <tag-list :list="props.tagData" />
      </span>
    </h1>
    <div v-if="props.description" class="text-sm text-gray-400 mb-4">
      {{ props.description }}
    </div>
    <div v-else-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
