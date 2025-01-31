<script setup lang="ts">
import functionPlot from 'function-plot'

onMounted(() => {
  console.log('mount')
  secp256k1Plot()
})

function secp256k1Plot() {
  functionPlot({
    target: '#ecc',
    grid: true,
    tip: {
      renderer(x, y) {
        return `(${formatTooltip(x)}, ${formatTooltip(y)})`
      },
      xLine: true,
      yLine: true,
    },
    data: [
      {
        fn: `sqrt(x^3+${a.value} * x+${b.value})`,
        color: '#F56C6C',
      },
      {
        fn: `-sqrt(x^3+${a.value} * x+${b.value})`,
        color: '#F56C6C',
      },
    ],
  })
}
const a = ref(-1)
const b = ref(1)

watchEffect(() => {
  console.log('effect')
  secp256k1Plot()
})

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}

const isValid = computed(() => {
  console.log(4 * a.value ** 3 + 27 * b.value ** 2)
  return 4 * a.value ** 3 + 27 * b.value ** 2 === 0
})

const computeFormula = computed(() => {
  return getEccFormula(a.value, b.value)
})
</script>
<template>
  <div class="flex flex-wrap gap-6 p-6">
    <div class="flex flex-col p-10 border rounded">
      <h1 class="text-center font-bold">Secp256k1</h1>
      <p class="text-sm py-2">Secp256k1是一条特定的椭圆曲线</p>

      <ul class="pl-6">
        <li class="list-disc">
          Sec 是 Standards for Efficient Cryptography(高效密码学标准) 的缩写
        </li>
        <li class="list-disc">p 是素数 prime 的缩写, 256 表示素数是 256 位</li>
        <li class="list-disc">k 表示 Koblitz 曲线的缩写, 1 表示是第一个具有这些特征的曲线</li>
      </ul>
      <p class="text-sm py-2">
        在 Secp256k1 椭圆曲线方程中 a=0,b=7 <katex formula="y^2=x^3+7\mod \ p" />
      </p>

      <p class="text-center font-bold">
        <katex formula="y^2=x^3+ax+b,\space\space 4a^3+27b^2\neq0" />
      </p>
      <div id="secp256k1"></div>
      <p class="text-[12px] text-[#f56c6c] flex justify-center mb-2">
        <katex :formula="computeFormula" />
      </p>
      <div class="flex justify-center gap-6">
        <div class="flex items-center">
          <label class="pr-2">a: </label>
          <el-input-number v-model="a" size="small"></el-input-number>
        </div>
        <div class="flex items-center">
          <label class="pr-2">b: </label>
          <el-input-number v-model="b" size="small"></el-input-number>
        </div>

        <div v-if="isValid">
          <span class="text-red-500 font-bold pr-2">无效值</span>
          <span class="text-[12px]">
            <katex formula="a^3+27b^2\neq0" />
          </span>
        </div>
      </div>
      <!-- <el-descriptions :column="1" size="small" label-width="140">
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
      </el-descriptions> -->
    </div>
  </div>
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
