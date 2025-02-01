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
</script>
<template>
  <div class="flex flex-col p-10 border rounded finite-field-ecc">
    <h1 class="text-center font-bold">有限域椭圆曲线</h1>
    <p class="text-sm mt-4">
      在实数域上的椭圆曲线具有连续性的,
      这种连续性并不适用于安全加密。采用<b>取模</b>的方式将椭圆曲线的运算结果固定在一个范围内变成离散的点。
    </p>
    <p class="text-sm">
      椭圆曲线上的坐标 x 和 y 都是整数, 取值在包含有限个元素的有限域中, 记作
      <span class="text-[12px]"><katex formula="GF_{(p)}" /></span> 或
      <span class="text-[12px]"><katex formula="F_{p}" /></span>, 其中 p 是素数。
    </p>
    <p class="text-sm indent-[16px]">
      例如 <span class="text-[12px]"><katex formula="F_{5} = \{0, 1, 2, 3, 4\}" /> </span>,
      <span class="text-red-400">
        表示 x 和 y 坐标的值只能是
        <span class="text-[12px]"><katex formula="\{0, 1, 2, 3, 4\}" /></span>中的一个 </span
      >。
    </p>

    <p class="text-sm">
      取模 p 的有限域椭圆曲线方程为
      <span class="text-[12px]"><katex formula="y^2 = x^3 + ax + b \mod p" /></span>, 记作
      <span class="text-[12px]"><katex formula="E_{p}(a,b)" /></span>。
    </p>
    <p class="text-sm indent-[16px]">
      例如:
      <span class="text-[12px]"> <katex formula="E_{5}(1,1): y^2 = x^3 + x + 1\mod\ 5" /></span>
    </p>
    <p class="text-sm">
      计算有限域椭圆曲线上的点时, 首先是确定 p 的值。 然后通过 x的值计算 y 的值，如果 y 的值不在 0
      到 p-1 之间, 则为无效点。
    </p>

    <p class="text-sm indent-[16px]">
      例如:
      <span class="text-[12px]">
        <katex formula="E_{5}(1, 1): y^2 = x^3 +x + 1\mod\ 5, F_5=\{0, 1,2, 3, 4\}"
      /></span>
    </p>
    <p class="text-sm">由于 x 和 y 的取值是在有限域中整数，因此对于上式中有多个可组合的点:</p>
    <p class="text-sm indent-[16px]">
      <span class="text-[12px]"> <katex formula="x=0, y=1" />: </span>

      <span><katex formula="y^2=1" /></span> 和 <katex formula="x^3 +x + 1 = 1" />
      等式两边值为 , 各对 5 取模结果都为 1, 该点有效
    </p>

    <p class="text-sm indent-[16px]">
      <span class="text-[12px]"> <katex formula="x = 0, y = 2" />: </span>
      等式左边对 5 取模结果为 4, 等式右边对 5 取模结果为 1, 该点无效
    </p>

    <p class="text-sm indent-[16px]">
      <span class="text-[12px]"> <katex formula="x = 0, y = 4" />: </span>
      等式两边对 5 取模结果都为 1, 该点有效
    </p>
    <p class="text-sm indent-[16px]">...</p>
    <p class="text-sm">
      如此遍历下去, 便能确定最终的有效点为
      <span class="text-[12px]">
        <katex formula="(0, 1)\ (0,4)\ (2, 1)\ (2, 4), \ (3, 1)\ (3, 4)\ (4,2)\ (4,3)" />
      </span>
    </p>

    <p class="text-center font-bold mt-4">
      <katex formula="y^2 = x^3 + x + 1\mod\ 5" />
    </p>
  </div>
</template>
<style>
.finite-field-ecc .katex-display {
  margin: 0;
}
</style>
