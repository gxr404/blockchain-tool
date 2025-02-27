<script setup lang="ts">
import functionPlot from 'function-plot'

const a = ref(10)
const d = ref(6)

onMounted(() => {
  twistedEdwards()
})
watchEffect(() => {
  // console.log('effect')
  twistedEdwards()
})

function twistedEdwards() {
  functionPlot({
    target: '#twisted-edwards',
    grid: true,
    xAxis: { domain: [-4, 4] },
    tip: {
      renderer(x, y) {
        return `(${formatTooltip(x)}, ${formatTooltip(y)})`
      },
      xLine: true,
      yLine: true,
    },

    data: [
      {
        fn: `sqrt((1 - ${a.value} * x^2) / (1 - ${d.value} * x^2))`,
        color: '#F56C6C',
        // graphType: 'polyline',
        // nSamples: 1000,
        // range: [-Infinity, -0.1],
      },

      {
        fn: `-sqrt((1 - ${a.value} * x^2) / (1 - ${d.value} * x^2))`,
        color: '#F56C6C',
        // graphType: 'polyline',
        // range: [Infinity, 0.1],
      },
      // {
      //   fn: `1 + ${d.value} * x^2 * y^2 - y^2 -${a.value} * x^2`,
      //   color: '#F56C6C',
      //   fnType: 'implicit',
      // },
      // {
      //   // fn: `1 + ${d.value} * x^2 * y^2 - y^2 -${a.value} * x^2`,
      //   color: '#F56C6C',
      //   // fnType: 'implicit',
      //   fn: function (scope) {
      //     console.log(scope.x ** 2)
      //     if (1 - d.value * scope.x ** 2 === 0) return null
      //     return Math.sqrt((1 - a.value * scope.x ** 2) / (1 - d.value * scope.x ** 2))
      //     //   // scope.x = Number
      //     //   return (
      //     //     1 +
      //     //     d.value * scope.x * scope.x * scope.y * scope.y -
      //     //     scope.y * scope.y -
      //     //     a.value * scope.x * scope.x
      //     //   )
      //   },
      //   // graphType: 'polyline',

      //   // nSamples: 10,
      //   // graphType: 'scatter',
      //   // graphType: 'interval',
      //   // sampler: 'builtIn',
      //   // fnType: 'linear',
      //   // graphType: 'polyline',
      //   // range: [-10, 10],
      // },
    ],
  })
}
const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
const isValid = computed(() => {
  return a.value == 0 || d.value === 0
})
const isWarning = computed(() => {
  return a.value === 1
})
</script>
<template>
  <div class="flex flex-wrap gap-10 p-10">
    <content-card title="Twisted Edwards">
      <template #description>
        <div>
          <p>
            扭曲的爱德华兹曲线
            <a
              class="hover:text-[#409eff] underline cursor-pointer"
              href="https://en.wikipedia.org/wiki/Twisted_Edwards_curve"
              target="_blank"
              >wiki</a
            >
          </p>
          <p class="text-center font-bold mt-4">
            <katex formula="ax^2 + y^2 = 1 + d x^2 y^2" />
          </p>
        </div>
      </template>
      <div id="twisted-edwards" class="flex justify-center"></div>

      <div class="flex justify-center gap-6">
        <div class="flex items-center">
          <label class="pr-2">a: </label>
          <el-input-number v-model="a" size="small"></el-input-number>
        </div>
        <div class="flex items-center">
          <label class="pr-2">d: </label>
          <el-input-number v-model="d" size="small"></el-input-number>
        </div>

        <div v-if="isValid">
          <span class="text-[#F56C6C] font-bold pr-2">无效值</span>
          <span class="text-[12px] text-[#F56C6C]">
            <katex formula="a\neq0, b\neq0" />
          </span>
        </div>
        <div v-if="isWarning">
          <span class="text-[#E6A23C] font-bold pr-2">a=1时退化为普通的Edwards曲线</span>
        </div>
      </div>
    </content-card>
    <cryptology-edwards25519 />
  </div>
</template>
