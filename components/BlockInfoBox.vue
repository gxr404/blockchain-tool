<script lang="ts" setup>
interface BlockInfo {
  height: string
  txCount: string
  hash: string
}
interface Props {
  blockInfo: BlockInfo
}
const props = withDefaults(defineProps<Props>(), {
  blockInfo() {
    return {
      height: '',
      txCount: '',
      hash: '',
    }
  },
})
</script>
<template>
  <div>
    <el-card style="max-width: 480px" shadow="never">
      <template #header>
        <h1 class="font-bold text-lg">Block</h1>
      </template>
      <p><span class="font-bold">Height: </span>{{ props.blockInfo.height }}</p>
      <p><span class="font-bold">txCount: </span>{{ props.blockInfo.txCount }}</p>
      <p><span class="font-bold">hash: </span>{{ props.blockInfo.hash }}</p>
      <!-- <template #footer>Footer content</template> -->
    </el-card>
  </div>
</template>
