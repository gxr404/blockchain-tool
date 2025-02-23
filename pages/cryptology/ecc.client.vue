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
    <div class="flex flex-wrap gap-10 p-10">
      <cryptology-ecc-base />
      <cryptology-finite-field-ecc />
      <!-- 公钥计算 -->
      <content-card title="公钥计算">
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
      </content-card>
      <content-card title="椭圆曲线的应用">
        <ul>
          <li class="list-disc">
            <p>
              数字签名: 用于确 <span class="font-bold">保数据的完整性</span> 和
              <span class="font-bold">身份验证</span> ，防止篡改和伪造
            </p>
          </li>
          <li>
            <p>加密: 用于 保护数据的机密性，确保只有授权方能够读取数据内容</p>
          </li>

          <li>
            数字签名和 加密的区别
            <p>
              数字签名是为了证明 <span class="font-bold">谁</span>发送了数据，并且确保数据没被篡改
            </p>
            <p>加密： 隐藏数据，使未经授权的人无法读取</p>

            <p>
              签名: 发送方用私钥签名，接收方用公钥验证 加密:
              发送方用接收方公钥加密，接收方用私钥解密
            </p>
            <p>签名:数据仍是明文 加密: 数据变为密文</p>
            <p>签名: 能确定是 A 发送了数据(即使签名数据被盗了也能确定是A本人发送过的数据 )</p>
            <p>
              加密: 并不能确定数据是否是对方的，虽然是对方发的也有可能是对方盗用的
              无法确定是她发送的
            </p>

            <p>数字签名：任何人 都可以用公钥验证签名的真实性和数据完整性。</p>
            <p>加密：只有授权的人（即持有对应私钥的人）才能解密并查看数据内容。</p>
          </li>

          <li>密钥交换</li>
          <li>...</li>
        </ul>
      </content-card>
    </div>
  </div>
</template>
