<script setup lang="ts">
import KaTeX from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  formula: string
}

const props = defineProps<Props>()

const latexHtml = computed(() => {
  return KaTeX.renderToString(props.formula, {
    displayMode: true,
    errorColor: '',
    output: 'html',
  })
})
</script>

<template>
  <div class="katex inline-block" v-html="latexHtml"></div>
</template>

<style>
.katex-sm {
  font-size: 1em;
}
</style>
