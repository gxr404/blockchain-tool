<script setup lang="ts">
import functionPlot from 'function-plot'

onMounted(() => {
  // console.log('mount')
  ecc()
})

function ecc() {
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
  // console.log('effect')
  ecc()
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
  <div class="flex flex-col p-10 border rounded">
    <h1 class="text-center font-bold">椭圆曲线</h1>
    <p class="text-sm text-gray-400 py-2">
      椭圆曲线加密算法(Elliptic curve cryptography)简称 ECC, 是一种非对称加密算法。
    </p>
    <p class="text-center font-bold">
      <katex formula="y^2=x^3+ax+b,\space\space 4a^3+27b^2\neq0" />
    </p>
    <div id="ecc"></div>
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
  </div>
</template>
