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
  ecc()
})

const formatTooltip = (val: number) => {
  return Math.floor(val * 100) / 100
}
</script>
<template>
  <content-card title="有限域椭圆曲线">
    <div class="mb-4">
      <p class="text-sm">
        在实数域上的椭圆曲线具有连续性的, 这种连续性并不适用于安全加密。<span
          class="text-gray-50"
        ></span
        >(实数域的话会很多小数的点)
      </p>
      <p class="text-sm">采用<b>取模</b>的方式将椭圆曲线的运算结果固定在一个范围内变成离散的点。</p>
      <div class="text-center mt-4">
        <katex formula="y^2 \equiv x^3+ax+b \bmod p" />
      </div>
      <div class="danger-tips text-sm my-2">
        !!! 注意<br />
        这里是 同余符号"≡" 而不是等号"=" , 代入方程应该是
        <katex class="katex-sm" formula="y^2 \bmod p = x^3+ax+b \bmod p" />
      </div>
    </div>

    <div class="mb-4">
      <div class="text-sm">
        椭圆曲线上的坐标 x 和 y 都是整数, 取值在包含有限个元素的有限域中, 记作
        <katex class="katex-sm" formula="GF_{(p)}" /> 或 <katex class="katex-sm" formula="F_{p}" />,
        其中 p 是<b>素数</b>。
      </div>
      <div class="text-sm indent-[16px]">
        例如 <katex class="katex-sm" formula="F_{5} = \{0, 1, 2, 3, 4\}" /> ,
        <span class="text-[var(--color-danger)]">
          表示 x 和 y 坐标的值只能是
          <katex class="katex-sm" formula="\{0, 1, 2, 3, 4\}" />中的一个 。
        </span>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-sm">
        取模 p 的有限域椭圆曲线方程为
        <katex class="katex-sm" formula="y^2 \equiv x^3 + ax + b \bmod p" />, 记作
        <katex class="katex-sm" formula="E_{p}(a,b)" />。
      </p>
      <p class="text-sm indent-[16px]">
        例如:
        <katex class="katex-sm" formula="E_{5}(1,1)" />
        则对应的方程是
        <katex class="katex-sm" formula="y^2 \equiv x^3 + x + 1\bmod 5" />
      </p>
    </div>
    <div class="mb-4">
      <p class="text-sm">
        计算有限域椭圆曲线上的点时, 首先是确定 p 的值。然后通过 x的值计算 y 的值，如果 y 的值不在 0
        到 p-1 之间, 则为无效点。
      </p>

      <div class="text-sm indent-[16px]">
        例如: &nbsp;&nbsp;
        <katex
          class="katex-sm"
          formula="E_{5}(1, 1): y^2 \equiv x^3 +x + 1\bmod5, F_5=\{0, 1,2, 3, 4\}"
        />
      </div>
      <p class="text-sm pl-[36px] mb-2">
        由于 x 和 y 的取值是在有限域中整数，因此对于上式中有多个可组合的点:
      </p>
      <div class="pl-[50px]">
        <div class="text-sm">
          <katex class="katex-sm" formula="x=0, y=1" />:
          <!-- <br />
        即代入y计算: <katex class="katex-sm" formula="y^2 \bmod5" /><br />
        即代入x计算: <katex class="katex-sm" formula="x^3 +x + 1 \bmod5" /> <br /> -->
          <katex class="katex-sm" formula="y^2=1" /> 和
          <katex class="katex-sm" formula="x^3 +x + 1 = 1" />
          等式两边值为 , 各对 5 取模结果都为 1, 该点有效
        </div>
        <p class="text-sm">
          <katex class="katex-sm" formula="x = 0, y = 2" />: 等式左边对 5 取模结果为 4, 等式右边对 5
          取模结果为 1, 该点无效
        </p>

        <p class="text-sm">
          <katex class="katex-sm" formula="x = 0, y = 4" />: 等式两边对 5 取模结果都为 1, 该点有效
        </p>
        <p class="text-sm">...</p>
      </div>
      <p class="text-sm pl-[36px] mt-2">
        如此遍历下去, 便能确定最终的有效点为
        <katex
          class="katex-sm"
          formula="(0, 1)\ (0,4)\ (2, 1)\ (2, 4), \ (3, 1)\ (3, 4)\ (4,2)\ (4,3)"
        />
      </p>
      <!-- <p class="text-center font-bold mt-4">
        <katex class="katex-sm" formula="y^2 \equiv x^3 + x + 1\mod\ 5" />
      </p> -->
    </div>
  </content-card>
</template>
<style>
.finite-field-ecc .katex-display {
  margin: 0;
}
</style>
