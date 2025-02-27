<script setup lang="ts">
// onMounted(() => {
//   // edwards25519()
//   // curve25519()
// })

// function edwards25519() {
//   functionPlot({
//     target: '#edwards25519',
//     title: 'Edwards25519',
//     grid: true,
//     tip: {
//       renderer(x, y) {
//         return `(${formatTooltip(x)}, ${formatTooltip(y)})`
//       },
//       xLine: true,
//       yLine: true,
//     },
//     data: [
//       {
//         fn: `sqrt((1 + x^2) / (1 +  121665/121666 * x^2))`,
//         color: '#F56C6C',
//       },
//       {
//         fn: `-sqrt((1 + x^2) / (1 +  121665/121666 * x^2))`,
//         color: '#F56C6C',
//       },
//     ],
//   })
// }

// function curve25519() {
//   functionPlot({
//     target: '#curve25519',
//     title: 'Curve25519',
//     grid: true,
//     tip: {
//       renderer(x, y) {
//         return `(${formatTooltip(x)}, ${formatTooltip(y)})`
//       },
//       xLine: true,
//       yLine: true,
//     },

//     data: [
//       // {
//       //   fn: `sqrt(x^3+486662*x^2+x)`,
//       //   color: '#F56C6C',
//       // },
//       // // {
//       // //   fn: `-sqrt(x^3+486662*x^2+x)`,
//       // //   color: '#F56C6C',
//       // // },
//       {
//         fn: 'x^3 + 486662*x^2+x-y^2',
//         color: '#F56C6C',
//         fnType: 'implicit',
//       },
//     ],
//   })
// }
// {\displaystyle -x^{2}+y^{2}=1-{\frac {121665}{121666}}x^{2}y^{2},}

// const formatTooltip = (val: number) => {
//   return Math.floor(val * 100) / 100
// }
</script>
<template>
  <content-card title="Edwards25519" :tag-data="['solana']">
    <p>Edwards25519 Montgomery curve</p>

    <p>Edwards25519 是 Twisted Edwards 曲线，方程形式为：</p>
    <p><katex class="katex-sm" formula="-x^2 + y^2 = 1 - \frac{121665}{121666} x^2 y^2" /></p>
    <p>Curve25519 是一种 Montgomery 曲线，方程形式为：</p>
    <p><katex class="katex-sm" formula="v^2 = u^3 + 486662u^2 + u" /></p>
    <p>这两条曲线虽然不同的方程，但是两者是 “birationally equivalent”（双有理等价）</p>
    <p>意味着 在Edwards25519的点 <span class="font-bold">存在唯一对应</span>的Curve25519的点</p>

    <div id="edwards25519"></div>
    <div id="curve25519"></div>
  </content-card>
</template>
