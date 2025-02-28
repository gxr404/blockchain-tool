<script setup lang="ts">
import functionPlot from 'function-plot'
import Katex from '../katex.vue'

onMounted(() => {
  exponential()
})

function exponential() {
  functionPlot({
    target: '#exponential',
    grid: true,
    tip: {
      renderer(x, y, index) {
        const formula = index === 0 ? `y = a^x (a > 1)` : `y = a^x (0 < a < 1)`
        return `(${formatTooltip(x)}, ${formatTooltip(y)}) ${formula}`
      },
    },
    data: [
      {
        fn: `${incrementalFunVal.value}^x`,
        graphType: 'polyline',
        color: '#F56C6C',
      },
      {
        fn: `${decreaseFunVal.value}^x`,
        graphType: 'polyline',
        color: '#67C23A',
      },
    ],
    xAxis: {
      domain: [-6, 6],
    },
    yAxis: {
      domain: [-1, 10],
    },
  })
}

const incrementalFunVal = ref(2)
const decreaseFunVal = ref(0.5)

watchEffect(() => {
  exponential()
})

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
</script>
<template>
  <content-card class="w-auto">
    <h1 class="text-center font-bold">指数函数 <katex formula="y=a^x" /></h1>
    <div id="exponential"></div>
    <el-descriptions :column="1" size="small" label-width="140">
      <el-descriptions-item
        label="x = 0, y = 1"
        label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
      >
      </el-descriptions-item>
      <el-descriptions-item
        label="a > 1, y单调递增: "
        label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
      >
        <div class="inline-block pl-1">
          <el-slider
            class="red-bar"
            size="small"
            v-model="incrementalFunVal"
            :format-tooltip="formatTooltip"
            :min="2"
            :max="10"
            :step="0.01"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item
        label="0 < a < 1, y单调递减: "
        label-class-name="font-bold relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-black"
      >
        <div class="inline-block pl-1">
          <el-slider
            class="green-bar"
            size="small"
            v-model="decreaseFunVal"
            :format-tooltip="formatTooltip"
            :max="1"
            :min="0.01"
            :step="0.01"
          />
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </content-card>
</template>

<style>
.red-bar,
.green-bar {
  width: 200px;
}
.red-bar {
  --el-slider-main-bg-color: #f56c6c;
}
.green-bar {
  --el-slider-main-bg-color: #67c23a;
}
#exponential .tip .inner-tip text {
  font-weight: bold;
}
</style>
