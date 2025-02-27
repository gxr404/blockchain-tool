<script setup lang="ts">
onMounted(() => {
  // edwards25519()
  // curve25519()
})
</script>
<template>
  <content-card title="Ed25519">
    <p>Ed25519是基于 Edwards25519 曲线的<span class="font-bold">签名算法</span></p>
    <p>Ed: 指Edwards曲线用于数字签名</p>
    <p>
      25519: 指使用的特定曲线 Curve25519, Curve25519 这条椭圆曲线，它是 Edwards 曲线族中的一个成员
      用于密钥交换
    </p>

    Edwards25519 和 Curve25519 其实是 基于同一条椭圆曲线， Edwards25519(Curve25519 的 Twisted
    Edwards 形式)
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
