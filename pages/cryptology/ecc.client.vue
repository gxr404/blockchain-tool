<script setup lang="ts">
import { Link } from '@element-plus/icons-vue'
</script>

<template>
  <div>
    <div class="pt-6 px-6">
      <a
        class="underline text-[#409eff] hover:text-[#347ecc]"
        target="_blank"
        href="https://bitcoin.heapup.tech/cryptology/ecc/ecc"
      >
        <Link class="w-[16px] h-[16px] inline-block align-middle" />
        <span class="font-bold">&nbsp;建议看 bitcoin ninja 的ecc</span>
      </a>
    </div>
    <div class="flex flex-wrap gap-6 p-6">
      <cryptology-ecc-base />
      <cryptology-finite-field-ecc />
      <div class="flex flex-col p-10 border rounded bg-white finite-field-ecc">
        <!-- <h1 class="text-center font-bold">有限域椭圆曲线</h1> -->
        <h1 class="font-bold py-2">公钥计算</h1>
        <p class="my-2">在椭圆曲线加密算法中，给定椭圆曲线E 和 曲线上的基点 G。</p>
        <p class="text-sm">计算出 G 的阶为 n, 之后在 {1, ..., n-1}中随机选择一个整数 k 作为私钥</p>
        <p class="text-sm">
          公钥 <b>H = k * G</b>, H是曲线上的一个点, G是基点,
          k则是256位的随机数(即求的是点倍乘的结果)
        </p>
        <p class="text-sm">为什么 ECC 安全性高?</p>
        <div class="pl-4 text-sm leading-6">
          <p>在已知 H 和 G 的情况下，计算 k 是非常困难的。(即公钥反推私钥)</p>
          <p>因为计算 k 并不能用简单的线性运算 k= G/H 求出结果。(因为是点倍乘的运算)</p>
          <p>H 是 k 个 G 相加的结果, 这种加法的计算并不是简单的代数运算。</p>
          <p>如果直接给出一个点 H, 无法直接计算是由多少 k 个 G 点相加的结果。</p>
          <p>只能从 1G,2G,3G,... 如此不断地尝试, 直到结果等于 H, 才能得到 k。</p>
          <p>
            当 k 是一个很大的数时, 这个过程的难度将变的非常大, 即使以现在最快的计算机,
            尝试所有可能的 k 值也需要远超过宇宙年龄的时间。
          </p>
        </div>
        <p class="font-bold my-2">
          总结即是: 从 [1, n-1] 中选择一个随机数 k 作为私钥, 而公钥 H = k * G
        </p>
      </div>
    </div>
  </div>
</template>
