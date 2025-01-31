<script setup lang="ts">
import functionPlot from 'function-plot'
import Katex from '../katex.vue'

onMounted(() => {
  triangle()
})

function triangle() {
  functionPlot({
    target: '#triangle',
    grid: true,
    tip: {
      renderer(x, y, index) {
        const formulaMap = new Map([
          [0, `y=sin(x)`],
          [1, `y=cos(x)`],
          [2, `y=tan(x)`],
        ])
        return `(${formatTooltip(x)}, ${formatTooltip(y)}) ${formulaMap.get(index)}`
      },
    },
    data: [
      {
        fn: `sin(x)`,
        graphType: 'polyline',
        color: '#F56C6C',
      },
      {
        fn: `cos(x)`,
        graphType: 'polyline',
        color: '#67C23A',
      },
      {
        fn: `tan(x)`,
        graphType: 'polyline',
        color: '#409EFF',
        range: [-Math.PI / 2, Math.PI / 2],
      },
    ],
    xAxis: {
      domain: [-12, 12],
    },
    yAxis: {
      domain: [-4, 4],
    },
  })
}

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
</script>
<template>
  <div class="flex flex-col p-10 border rounded">
    <h1 class="text-center font-bold">
      三角函数
      <katex
        formula="\left\{ \begin{array}{l} y=sin{x} \\ y=cos{x} \\  y = tan{x} \end{array} \right."
      />
    </h1>
    <div id="triangle"></div>
    <!-- <el-descriptions :column="1" size="small" label-width="140">
      <el-descriptions-item
        label="x = 1, y = 0"
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
    </el-descriptions> -->
  </div>
</template>

<style>
.red-bar,
.green-bar,
.blur-bar {
  width: 200px;
}
.red-bar {
  --el-slider-main-bg-color: #f56c6c;
}
.green-bar {
  --el-slider-main-bg-color: #67c23a;
}
.blur-bar {
  --el-slider-main-bg-color: #409eff;
}
#triangle .tip .inner-tip text {
  font-weight: bold;
}
</style>
